export interface LedgerEvent {
	transactionId: string;
	accountId: string;
	amount: number;
	newBalance: number;
	timestamp: number;
}
