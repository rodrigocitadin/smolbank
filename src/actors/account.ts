import { DurableObject } from "cloudflare:workers";
import { LedgerEvent } from "@/types";

export class AccountActor extends DurableObject<Env> {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async createAccount(passwordHash: string): Promise<{ success: boolean; error?: string }> {
		const isInitialized = await this.ctx.storage.get<boolean>("initialized");

		if (isInitialized) {
			return { success: false, error: "Account already exists" };
		}

		await this.ctx.storage.put({
			"initialized": true,
			"balance": 0,
			"passwordHash": passwordHash
		});

		console.log(`[DO] Account ${this.ctx.id.toString()} created successfully.`);
		return { success: true };
	}

	async verifyLogin(passwordHash: string): Promise<{ success: boolean; error?: string }> {
		const isInitialized = await this.ctx.storage.get<boolean>("initialized");
		if (!isInitialized) return { success: false, error: "Account does not exist" };

		const storedHash = await this.ctx.storage.get<string>("passwordHash");

		if (storedHash !== passwordHash) {
			return { success: false, error: "Invalid credentials" };
		}

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
}
