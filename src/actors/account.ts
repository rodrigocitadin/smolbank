import { DurableObject } from "cloudflare:workers";
import { LedgerEvent } from "../types";

export class AccountActor extends DurableObject<Env> {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	async processEntry(transactionId: string, amount: number): Promise<{ success: boolean; balance: number; error?: string }> {
		const txKey = `tx_${transactionId}`;
		const alreadyProcessed = await this.ctx.storage.get(txKey);

		let balance = (await this.ctx.storage.get<number>("balance")) || 0;

		if (alreadyProcessed) {
			console.log(`[DO] Transaction ${transactionId} already processed.`);
			return { success: true, balance };
		}

		if (balance + amount < 0) {
			return { success: false, balance, error: "Insufficient balance" };
		}

		balance += amount;

		await this.ctx.storage.put({
			"balance": balance,
			[txKey]: true
		});

		console.log(`[DO] Account ${this.ctx.id.toString()} | Amount ${amount} | Balance ${balance}`);

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
