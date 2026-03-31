import { HEADERS } from "@/consts";
import { TokenPayload, TransferRequest } from "@/types";
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
		const { fromAccountId, toAccountId, amount } = body;

		if (amount <= 0) return new Response(JSON.stringify({ error: "Amount must be greater than zero" }), { status: 400, headers: HEADERS });

		if (fromAccountId !== loggedInAccountId) {
			return new Response(JSON.stringify({ error: "You can only transfer money from your own account" }), { status: 403, headers: HEADERS });
		}

		const transactionId = crypto.randomUUID();

		const fromId = env.ACCOUNT_ACTOR.idFromName(fromAccountId);
		const toId = env.ACCOUNT_ACTOR.idFromName(toAccountId);

		const fromStub = env.ACCOUNT_ACTOR.get(fromId);
		const toStub = env.ACCOUNT_ACTOR.get(toId);

		const debitResult = await fromStub.processEntry(transactionId, -amount);
		if (!debitResult.success) {
			return new Response(JSON.stringify({ error: debitResult.error }), { status: 400, headers: HEADERS });
		}

		const creditResult = await toStub.processEntry(transactionId, amount);

		if (!creditResult.success) {
			await fromStub.processEntry(`${transactionId}-rollback`, amount);
			return new Response(JSON.stringify({ error: "Transfer failed, rollback done." }), { status: 500, headers: HEADERS });
		}

		return new Response(JSON.stringify({
			message: "Transfer done!",
			transactionId,
			fromBalance: debitResult.balance,
		}), { headers: HEADERS });

	} catch (e: any) {
		return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: HEADERS });
	}
}
