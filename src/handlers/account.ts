import { HEADERS } from "@/consts/headers";
import { TokenPayload } from "@/types";
import { AccountActor } from "@/actors/account";
import jwt from "@tsndr/cloudflare-worker-jwt";

export async function handleGetAccountInfo(request: Request, env: Env): Promise<Response> {
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

		const url = new URL(request.url);
		const cursor = url.searchParams.get("cursor") || undefined;
		const limitParam = url.searchParams.get("limit");
		const limit = limitParam ? parseInt(limitParam, 10) : 10;

		const actorNamespace = env.ACCOUNT_ACTOR as DurableObjectNamespace<AccountActor>;
		const stub = actorNamespace.get(actorNamespace.idFromName(loggedInAccountId));

		const accountInfo = await stub.getAccountInfo(cursor, limit);

		return new Response(JSON.stringify({
			accountId: loggedInAccountId,
			balance: accountInfo.balance,
			transactions: accountInfo.transactions,
			nextCursor: accountInfo.nextCursor
		}), { status: 200, headers: HEADERS });

	} catch (e: any) {
		return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: HEADERS });
	}
}
