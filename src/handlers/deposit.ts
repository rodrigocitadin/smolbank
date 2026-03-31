import { HEADERS } from "@/consts";
import { DepositRequest } from "@/types";

export async function handleDeposit(request: Request, env: Env): Promise<Response> {
	const body = await request.json() as DepositRequest;

	const stub = env.ACCOUNT_ACTOR.get(env.ACCOUNT_ACTOR.idFromName(body.accountId));
	const res = await stub.processEntry(crypto.randomUUID(), body.amount);

	return new Response(JSON.stringify({ message: `Deposit done, new balance: ${res.balance}` }), { status: 200, headers: HEADERS });
}
