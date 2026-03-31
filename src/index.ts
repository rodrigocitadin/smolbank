import { handleAuth, handleDeposit, handleTransfer } from "@/handlers";
import { processLedgerBatch } from "@/consumers";
import { AccountActor } from "@/actors";

export { AccountActor };

export default {
	async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === "POST" && (url.pathname === "/account" || url.pathname === "/login")) {
			return handleAuth(request, env);
		}

		if (request.method === "POST" && url.pathname === "/transfer") {
			return handleTransfer(request, env);
		}

		if (request.method === "POST" && url.pathname === "/deposit") {
			return handleDeposit(request, env);
		}

		if (request.method === "GET" && url.pathname.startsWith("/debug/")) {
			const accountId = url.pathname.split("/")[2];

			if (!accountId) return new Response("Missing accountId", { status: 400 });

			const actorNamespace = env.ACCOUNT_ACTOR as DurableObjectNamespace<AccountActor>;
			const stub = actorNamespace.get(actorNamespace.idFromName(accountId));

			const state = await stub.getDebugState();

			return new Response(JSON.stringify({
				actorId: accountId,
				internalStorage: state
			}, null, 2), {
				headers: { "Content-Type": "application/json" }
			});
		}

		return new Response("Not Found", { status: 404 });
	},

	async queue(batch: MessageBatch<any>, _env: Env, _ctx: ExecutionContext): Promise<void> {
		await processLedgerBatch(batch);
	}
} satisfies ExportedHandler<Env>;
