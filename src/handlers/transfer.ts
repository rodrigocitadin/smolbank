import { AccountActor } from "@/actors";

export async function handleTransfer(request: Request, env: Env): Promise<Response> {
	try {
		const body = await request.json() as any;
		const { fromAccountId, toAccountId, amount } = body;

		if (amount <= 0) return new Response("Amount must be greater than zero", { status: 400 });

		const transactionId = crypto.randomUUID();

		const actorNamespace = env.ACCOUNT_ACTOR as DurableObjectNamespace<AccountActor>;

		const fromId = actorNamespace.idFromName(fromAccountId);
		const toId = actorNamespace.idFromName(toAccountId);

		const fromStub = actorNamespace.get(fromId);
		const toStub = actorNamespace.get(toId);

		const debitResult = await fromStub.processEntry(transactionId, -amount);
		if (!debitResult.success) {
			return new Response(JSON.stringify({ error: debitResult.error }), { status: 400 });
		}

		const creditResult = await toStub.processEntry(transactionId, amount);

		if (!creditResult.success) {
			await fromStub.processEntry(`${transactionId}-rollback`, amount);
			return new Response("Transfer failed. Rollback done", { status: 500 });
		}

		return new Response(JSON.stringify({
			message: "Transfer done successfully",
			transactionId,
			fromBalance: debitResult.balance,
		}), { headers: { "Content-Type": "application/json" } });

	} catch (e: any) {
		return new Response(`Error: ${e.message}`, { status: 500 });
	}
}
