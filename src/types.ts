export interface OutboxCreditTask {
	toAccountId: string;
	amount: number;
	transactionId: string;
}

export interface LedgerEvent {
	transactionId: string;
	accountId: string;
	amount: number;
	newBalance: number;
	timestamp: number;
}

// HTTP Types
export interface CreateAccountRequest {
	accountId: string;
	password: string;
}

export interface LoginRequest {
	accountId: string;
	password: string;
}

export interface TransferRequest {
	transactionId: string;
	fromAccountId: string;
	toAccountId: string;
	amount: number;
}

export interface DepositRequest {
	transactionId: string;
	accountId: string;
	amount: number;
}

// JWT Types
export interface TokenPayload {
	accountId: string;
	role: string;
	exp?: number;
}
