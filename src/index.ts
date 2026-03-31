import { handleTransfer } from "./handlers/transfer";
import { processLedgerBatch } from "./consumers/ledger";
import { AccountActor } from "./actors/account";

export { AccountActor };

export default {
	async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === "POST" && url.pathname === "/transfer") {
			return handleTransfer(request, env);
		}

		if (request.method === "POST" && url.pathname === "/deposit") {
			const { accountId, amount } = await request.json() as any;

			const actorNamespace = env.ACCOUNT_ACTOR as DurableObjectNamespace<AccountActor>;
			const stub = actorNamespace.get(actorNamespace.idFromName(accountId));

			const res = await stub.processEntry(crypto.randomUUID(), amount);
			return new Response(`Deposit done! Current balance: ${res.balance}`);
		}

		return new Response("Not Found", { status: 404 });
	},

	async queue(batch: MessageBatch<any>, _env: Env, _ctx: ExecutionContext): Promise<void> {
		await processLedgerBatch(batch);
	}
} satisfies ExportedHandler<Env>;
