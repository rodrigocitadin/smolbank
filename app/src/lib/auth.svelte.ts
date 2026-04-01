export const authState = new class AuthState {
	token = $state<string | null>(typeof window !== 'undefined' ? localStorage.getItem('token') : null);
	accountId = $state<string | null>(typeof window !== 'undefined' ? localStorage.getItem('accountId') : null);
	balance = $state<number>(0);

	login(token: string, accountId: string): void {
		this.token = token;
		this.accountId = accountId;
		localStorage.setItem('token', token);
		localStorage.setItem('accountId', accountId);
	}

	logout(): void {
		this.token = null;
		this.accountId = null;
		this.balance = 0;
		localStorage.removeItem('token');
		localStorage.removeItem('accountId');
		window.location.href = '/';
	}

	setBalance(newBalance: number): void {
		this.balance = newBalance;
	}
}();
