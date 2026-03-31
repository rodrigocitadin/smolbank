import { HEADERS } from "@/consts/headers";
import { DepositRequest } from "@/types";
import { AccountActor } from "@/actors/account";

export async function handleDeposit(request: Request, env: Env): Promise<Response> {
	const body = await request.json() as DepositRequest;

	if (!body.transactionId) {
		return new Response(JSON.stringify({ error: "Missing transactionId" }), { status: 400, headers: HEADERS });
	}

	const actorNamespace = env.ACCOUNT_ACTOR as DurableObjectNamespace<AccountActor>;
	const stub = actorNamespace.get(actorNamespace.idFromName(body.accountId));

	const res = await stub.receiveCredit(body.transactionId, body.amount);

	if (!res.success) {
		return new Response(JSON.stringify({ error: res.error }), { status: 400, headers: HEADERS });
	}

	return new Response(JSON.stringify({ message: "Deposit processed!" }), { status: 200, headers: HEADERS });
}
