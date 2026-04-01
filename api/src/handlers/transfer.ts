import { HEADERS } from "@/consts";
import { TokenPayload, TransferRequest } from "@/types";
import { AccountActor } from "@/actors";
import jwt from "@tsndr/cloudflare-worker-jwt";

export async function handleTransfer(request: Request, env: Env): Promise<Response> {
	try {
		const authHeader = request.headers.get("Authorization");
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return new Response(JSON.stringify({ error: "Missing or invalid token format" }), { status: 401, headers: HEADERS });
		}

		const token = authHeader.split(" ")[1];
		const isValid = await jwt.verify(token, env.JWT_SECRET);
		if (!isValid) {
			return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401, headers: HEADERS });
		}

		const { payload } = jwt.decode(token);
		const typedPayload = payload as TokenPayload;
		const loggedInAccountId = typedPayload.accountId;

		const body = await request.json() as TransferRequest;
		const { transactionId, fromAccountId, toAccountId, amount } = body;

		if (!transactionId) return new Response(JSON.stringify({ error: "Missing transactionId" }), { status: 400, headers: HEADERS });
		if (amount <= 0) return new Response(JSON.stringify({ error: "Amount must be greater than zero" }), { status: 400, headers: HEADERS });

		if (fromAccountId !== loggedInAccountId) {
			return new Response(JSON.stringify({ error: "You can only transfer money from your own account" }), { status: 403, headers: HEADERS });
		}

		const actorNamespace = env.ACCOUNT_ACTOR as DurableObjectNamespace<AccountActor>;

		const fromId = actorNamespace.idFromName(fromAccountId);
		const fromStub = actorNamespace.get(fromId);

		const debitResult = await fromStub.sendTransfer(transactionId, toAccountId, amount);

		if (!debitResult.success) {
			return new Response(JSON.stringify({ error: debitResult.error }), { status: 400, headers: HEADERS });
		}

		return new Response(JSON.stringify({
			message: "Transfer initiated successfully!",
			transactionId,
			fromBalance: debitResult.balance,
		}), { status: 202, headers: HEADERS });

	} catch (e: any) {
		return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: HEADERS });
	}
}
