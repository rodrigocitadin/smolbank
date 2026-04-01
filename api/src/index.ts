import { handleAuth, handleDeposit, handleGetAccountInfo, handleTransfer } from "@/handlers";
import { processLedgerBatch } from "@/consumers";
import { AccountActor } from "@/actors";
import { HEADERS } from "@/consts";

export { AccountActor };

export default {
	async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: HEADERS
			});
		}

		const url = new URL(request.url);

		if (request.method === "GET" && url.pathname === "/account") {
			return handleGetAccountInfo(request, env);
		}

		if (request.method === "POST" && (url.pathname === "/account" || url.pathname === "/login")) {
			return handleAuth(request, env);
		}

		if (request.method === "POST" && url.pathname === "/transfer") {
			return handleTransfer(request, env);
		}

		if (request.method === "POST" && url.pathname === "/deposit") {
			return handleDeposit(request, env);
		}

		return new Response("Not Found", { status: 404 });
	},

	async queue(batch: MessageBatch<any>, _env: Env, _ctx: ExecutionContext): Promise<void> {
		await processLedgerBatch(batch);
	}
} satisfies ExportedHandler<Env>;
