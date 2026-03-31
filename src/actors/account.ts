import { DurableObject } from "cloudflare:workers";
import { LedgerEvent, OutboxCreditTask } from "@/types";

export class AccountActor extends DurableObject<Env> {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async createAccount(passwordHash: string): Promise<{ success: boolean; error?: string }> {
		const isInitialized = await this.ctx.storage.get<boolean>("initialized");
		if (isInitialized) { return { success: false, error: "Account already exists" } }

		await this.ctx.storage.put({
			"initialized": true,
			"balance": 0,
			"passwordHash": passwordHash
		});
		return { success: true };
	}

	async verifyLogin(passwordHash: string): Promise<{ success: boolean; error?: string }> {
		const isInitialized = await this.ctx.storage.get<boolean>("initialized");
		if (!isInitialized) return { success: false, error: "Account does not exist" };

		const storedHash = await this.ctx.storage.get<string>("passwordHash");
		if (storedHash !== passwordHash) { return { success: false, error: "Invalid credentials" } }

		return { success: true };
	}

	async processEntry(transactionId: string, amount: number): Promise<{ success: boolean; balance: number; error?: string }> {
		const isInitialized = await this.ctx.storage.get<boolean>("initialized");
		if (!isInitialized) return { success: false, balance: 0, error: "Account does not exist" };

		const txKey = `tx_${transactionId}`;
		const alreadyProcessed = await this.ctx.storage.get(txKey);

		let balance = (await this.ctx.storage.get<number>("balance")) || 0;

		if (alreadyProcessed) return { success: true, balance };

		if (balance + amount < 0) return { success: false, balance, error: "Insufficient balance" };

		balance += amount;

		await this.ctx.storage.put({ "balance": balance, [txKey]: true });

		const event: LedgerEvent = {
			transactionId,
			accountId: this.ctx.id.toString(),
			amount,
			newBalance: balance,
			timestamp: Date.now()
		};

		await this.env.LEDGER_QUEUE.send(event);
		return { success: true, balance };
	}

	async sendTransfer(transactionId: string, toAccountId: string, amount: number): Promise<{ success: boolean; balance: number; error?: string }> {
		const isInitialized = await this.ctx.storage.get<boolean>("initialized");
		if (!isInitialized) return { success: false, balance: 0, error: "Account does not exist" };

		const txKey = `tx_${transactionId}_debit`;
		const alreadyProcessed = await this.ctx.storage.get(txKey);
		let balance = (await this.ctx.storage.get<number>("balance")) || 0;

		if (alreadyProcessed) return { success: true, balance };

		if (balance - amount < 0) return { success: false, balance, error: "Insufficient balance" };

		balance -= amount;

		const creditTaskKey = `outbox_credit_${transactionId}`;
		const ledgerTaskKey = `outbox_ledger_${transactionId}`;

		const ledgerEvent: LedgerEvent = {
			transactionId,
			accountId: this.ctx.id.toString(),
			amount: -amount,
			newBalance: balance,
			timestamp: Date.now()
		};

		const creditTask: OutboxCreditTask = { toAccountId, amount, transactionId };

		await this.ctx.storage.put({
			"balance": balance,
			[txKey]: true,
			[creditTaskKey]: creditTask,
			[ledgerTaskKey]: ledgerEvent
		});

		await this.ctx.storage.setAlarm(Date.now() + 50);

		return { success: true, balance };
	}

	async receiveCredit(transactionId: string, amount: number): Promise<{ success: boolean; fatal?: boolean; error?: string }> {
		const isInitialized = await this.ctx.storage.get<boolean>("initialized");
		if (!isInitialized) return { success: false, fatal: true, error: "Account not found" };

		const txKey = `tx_${transactionId}_credit`;
		const alreadyProcessed = await this.ctx.storage.get(txKey);
		let balance = (await this.ctx.storage.get<number>("balance")) || 0;

		if (alreadyProcessed) return { success: true };

		balance += amount;

		const ledgerTaskKey = `outbox_ledger_${transactionId}_credit`;
		const ledgerEvent: LedgerEvent = {
			transactionId,
			accountId: this.ctx.id.toString(),
			amount: amount,
			newBalance: balance,
			timestamp: Date.now()
		};

		await this.ctx.storage.put({
			"balance": balance,
			[txKey]: true,
			[ledgerTaskKey]: ledgerEvent
		});

		await this.ctx.storage.setAlarm(Date.now() + 50);
		return { success: true };
	}

	async alarm(): Promise<void> {
		const outboxTasks = await this.ctx.storage.list({ prefix: "outbox_" });
		if (outboxTasks.size === 0) return;

		let hasTransientErrors = false;

		for (const [key, payload] of outboxTasks) {
			try {
				if (key.startsWith("outbox_ledger_")) {
					await this.env.LEDGER_QUEUE.send(payload as LedgerEvent);
					await this.ctx.storage.delete(key);
				}

				else if (key.startsWith("outbox_credit_")) {
					const data = payload as OutboxCreditTask;
					const actorNamespace = this.env.ACCOUNT_ACTOR as unknown as DurableObjectNamespace<AccountActor>;
					const destStub = actorNamespace.get(actorNamespace.idFromName(data.toAccountId));

					const res = await destStub.receiveCredit(data.transactionId, data.amount);

					if (res.success) {
						await this.ctx.storage.delete(key);
					}
					else if (res.fatal) {
						console.error(`[DO Alarm] Dest rejected tx ${data.transactionId} (Fatal). Initiating refund...`);

						let currentBalance = (await this.ctx.storage.get<number>("balance")) || 0;
						currentBalance += data.amount;

						const refundLedgerKey = `outbox_ledger_${data.transactionId}_refund`;
						const refundEvent: LedgerEvent = {
							transactionId: `${data.transactionId}_refund`,
							accountId: this.ctx.id.toString(),
							amount: data.amount,
							newBalance: currentBalance,
							timestamp: Date.now()
						};

						await this.ctx.storage.put({
							"balance": currentBalance,
							[refundLedgerKey]: refundEvent
						});
						await this.ctx.storage.delete(key);

						await this.ctx.storage.setAlarm(Date.now() + 50);
					}
					else {
						hasTransientErrors = true;
					}
				}
			} catch (e) {
				console.error(`[DO Alarm] Error processing task ${key}:`, e);
				hasTransientErrors = true;
			}
		}

		if (hasTransientErrors) {
			await this.ctx.storage.setAlarm(Date.now() + 5000);
		}
	}

	async getDebugState(): Promise<Record<string, any>> {
		const allData = await this.ctx.storage.list();
		return Object.fromEntries(allData);
	}
}
