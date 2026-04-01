import { LedgerEvent } from "@/types";

export async function processLedgerBatch(batch: MessageBatch<LedgerEvent>): Promise<void> {
	console.log(`\nBatch recieved with ${batch.messages.length} events`);

	for (const msg of batch.messages) {
		const event = msg.body;
		console.log(`Sent to TigerBeetle: TxID: ${event.transactionId} | Amount ${event.amount}`);
		msg.ack();
	}
	console.log(`Batch done\n`);
}
