import { hashPassword } from "@/utils/crypto";
import { CreateAccountRequest, LoginRequest } from "@/types";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { HEADERS } from "@/consts";

export async function handleAuth(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);

	if (url.pathname === "/account") {
		const body = await request.json() as CreateAccountRequest;
		const { accountId, password } = body;

		if (!accountId || !password) {
			return new Response(JSON.stringify({ error: "Missing accountId or password" }), { status: 400, headers: HEADERS });
		}

		const stub = env.ACCOUNT_ACTOR.get(env.ACCOUNT_ACTOR.idFromName(accountId));
		const passwordHash = await hashPassword(password);

		const result = await stub.createAccount(passwordHash);

		if (!result.success) {
			return new Response(JSON.stringify({ error: result.error }), { status: 409, headers: HEADERS });
		}

		return new Response(JSON.stringify({ message: `Account ${accountId} created!` }), { status: 201, headers: HEADERS });
	}

	if (url.pathname === "/login") {
		const body = await request.json() as LoginRequest;
		const { accountId, password } = body;

		if (!accountId || !password) {
			return new Response(JSON.stringify({ error: "Missing accountId or password" }), { status: 400, headers: HEADERS });
		}

		const stub = env.ACCOUNT_ACTOR.get(env.ACCOUNT_ACTOR.idFromName(accountId));
		const passwordHash = await hashPassword(password);

		const result = await stub.verifyLogin(passwordHash);

		if (!result.success) {
			return new Response(JSON.stringify({ error: result.error }), { status: 401, headers: HEADERS });
		}

		const token = await jwt.sign({
			accountId: accountId,
			role: "user",
			exp: Math.floor(Date.now() / 1000) + (1 * (60 * 60))
		}, env.JWT_SECRET);

		return new Response(JSON.stringify({ message: "Login successful", token: token }), { status: 200, headers: HEADERS });
	}

	return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: HEADERS });
}
