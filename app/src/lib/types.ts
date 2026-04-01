export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'REFUNDED';
export type TransactionType = 'SENT' | 'RECEIVED' | 'DEPOSITED';

export interface TransactionRecord {
	transactionId: string;
	type: TransactionType;
	counterparty: string;
	amount: number;
	timestamp: number;
	status: TransactionStatus;
}

export interface DashboardResponse {
	accountId: string;
	balance: number;
	transactions: TransactionRecord[];
	nextCursor?: number;
}

export interface MsgState {
	text: string;
	error: boolean;
}
