import { DurableObject } from "cloudflare:workers";
import { LedgerEvent, OutboxCreditTask, TransactionRecord } from "@/types";

export class AccountActor extends DurableObject<Env> {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async createAccount(passwordHash: string): Promise<{ success: boolean; error?: string }> {
		const isInitialized = await this.ctx.storage.get<boolean>("initialized");
		if (isInitialized) return { success: false, error: "Account already exists" };

		await this.ctx.storage.put({ "initialized": true, "balance": 0, "passwordHash": passwordHash });
		return { success: true };
	}

	async verifyLogin(passwordHash: string): Promise<{ success: boolean; error?: string }> {
		const isInitialized = await this.ctx.storage.get<boolean>("initialized");
		if (!isInitialized) return { success: false, error: "Account does not exist" };

		const storedHash = await this.ctx.storage.get<string>("passwordHash");
		if (storedHash !== passwordHash) return { success: false, error: "Invalid credentials" };
		return { success: true };
	}

	async getAccountInfo(cursor?: string, limit: number = 10): Promise<{ balance: number; transactions: TransactionRecord[]; nextCursor?: string }> {
		const balance = (await this.ctx.storage.get<number>("balance")) || 0;

		const listOptions: DurableObjectListOptions = {
			prefix: "history_",
			reverse: true,
			limit: limit
		};

		if (cursor) {
			listOptions.end = cursor;
		}

		const historyMap = await this.ctx.storage.list<TransactionRecord>(listOptions);
		const transactions = Array.from(historyMap.values());
		const keys = Array.from(historyMap.keys());

		let nextCursor: string | undefined = undefined;
		if (transactions.length === limit) {
			nextCursor = keys[keys.length - 1];
		}

		return {
			balance,
			transactions,
			nextCursor
		};
	}

	async sendTransfer(transactionId: string, toAccountId: string, amount: number, fromAccountId: string): Promise<{ success: boolean; balance: number; error?: string }> {
		const isInitialized = await this.ctx.storage.get<boolean>("initialized");
		if (!isInitialized) return { success: false, balance: 0, error: "Account does not exist" };

		const txKey = `tx_${transactionId}_debit`;
		const alreadyProcessed = await this.ctx.storage.get(txKey);
		let balance = (await this.ctx.storage.get<number>("balance")) || 0;

		if (alreadyProcessed) return { success: true, balance };
		if (balance - amount < 0) return { success: false, balance, error: "Insufficient balance" };

		balance -= amount;

		const timestamp = Date.now();
		const creditTaskKey = `outbox_credit_${transactionId}`;
		const ledgerTaskKey = `outbox_ledger_${transactionId}`;

		const historyKey = `history_${timestamp}_${transactionId}`;
		const historyRecord: TransactionRecord = {
			transactionId, type: 'SENT', counterparty: toAccountId, amount, timestamp, status: 'PENDING'
		};

		const ledgerEvent: LedgerEvent = {
			transactionId, accountId: this.ctx.id.toString(), amount: -amount, newBalance: balance, timestamp
		};

		const creditTask: OutboxCreditTask = { toAccountId, amount, transactionId, timestamp, fromAccountId };

		await this.ctx.storage.put({
			"balance": balance,
			[txKey]: true,
			[creditTaskKey]: creditTask,
			[ledgerTaskKey]: ledgerEvent,
			[historyKey]: historyRecord
		});

		await this.ctx.storage.setAlarm(Date.now() + 50);
		return { success: true, balance };
	}

	async receiveCredit(transactionId: string, fromAccountId: string, amount: number, isDeposit = false): Promise<{ success: boolean; fatal?: boolean; error?: string }> {
		const isInitialized = await this.ctx.storage.get<boolean>("initialized");
		if (!isInitialized) return { success: false, fatal: true, error: "Account not found" };

		const txKey = `tx_${transactionId}_credit`;
		const alreadyProcessed = await this.ctx.storage.get(txKey);
		let balance = (await this.ctx.storage.get<number>("balance")) || 0;

		if (alreadyProcessed) return { success: true };

		balance += amount;
		const timestamp = Date.now();
		const ledgerTaskKey = `outbox_ledger_${transactionId}_credit`;

		const historyKey = `history_${timestamp}_${transactionId}`;
		const historyRecord: TransactionRecord = {
			transactionId,
			type: isDeposit ? 'DEPOSITED' : 'RECEIVED',
			counterparty: fromAccountId,
			amount,
			timestamp,
			status: 'COMPLETED'
		};

		const ledgerEvent: LedgerEvent = {
			transactionId, accountId: this.ctx.id.toString(), amount, newBalance: balance, timestamp
		};

		await this.ctx.storage.put({
			"balance": balance,
			[txKey]: true,
			[ledgerTaskKey]: ledgerEvent,
			[historyKey]: historyRecord
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
					const actorNamespace = this.env.ACCOUNT_ACTOR as DurableObjectNamespace<AccountActor>;
					const destStub = actorNamespace.get(actorNamespace.idFromName(data.toAccountId));

					const res = await destStub.receiveCredit(data.transactionId, data.fromAccountId, data.amount);

					const historyKey = `history_${data.timestamp}_${data.transactionId}`;
					const historyRecord = await this.ctx.storage.get<TransactionRecord>(historyKey);

					if (res.success) {
						if (historyRecord) {
							historyRecord.status = 'COMPLETED';
							await this.ctx.storage.put(historyKey, historyRecord);
						}
						await this.ctx.storage.delete(key);
					}
					else if (res.fatal) {
						if (historyRecord) {
							historyRecord.status = 'REFUNDED';
							await this.ctx.storage.put(historyKey, historyRecord);
						}

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

						await this.ctx.storage.put({ "balance": currentBalance, [refundLedgerKey]: refundEvent });
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
}
