import { AccountActor } from "@/actors";
import { hashPassword } from "@/utils";
import jwt from "@tsndr/cloudflare-worker-jwt";

export async function handleAuth(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	const body = await request.json() as any;
	const { accountId, password } = body;

	if (!accountId || !password) {
		return new Response("Missing accountId or password", { status: 400 });
	}

	const actorNamespace = env.ACCOUNT_ACTOR as DurableObjectNamespace<AccountActor>;
	const stub = actorNamespace.get(actorNamespace.idFromName(accountId));
	const passwordHash = await hashPassword(password);

	if (url.pathname === "/account") {
		const result = await stub.createAccount(passwordHash);

		if (!result.success) {
			return new Response(JSON.stringify({ error: result.error }), { status: 409 });
		}

		return new Response(JSON.stringify({ message: `Account ${accountId} created!` }), {
			status: 201, headers: { "Content-Type": "application/json" }
		});
	}

	if (url.pathname === "/login") {
		const result = await stub.verifyLogin(passwordHash);

		if (!result.success) {
			return new Response(JSON.stringify({ error: result.error }), { status: 401 });
		}

		const token = await jwt.sign({
			accountId: accountId,
			role: "user",
			exp: Math.floor(Date.now() / 1000) + (1 * (60 * 60))
		}, env.JWT_SECRET);

		return new Response(JSON.stringify({ message: "Login successful", token }), {
			status: 200, headers: { "Content-Type": "application/json" }
		});
	}

	return new Response("Not Found", { status: 404 });
}
