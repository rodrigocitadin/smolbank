export const uiState = new class UIState {
	toast = $state<{ message: string; type: 'success' | 'error' } | null>(null);
	timeout: ReturnType<typeof setTimeout> | null = null;

	showToast(message: string, type: 'success' | 'error' = 'success'): void {
		this.toast = { message, type };

		if (this.timeout) clearTimeout(this.timeout);

		this.timeout = setTimeout(() => {
			this.toast = null;
		}, 4000);
	}
}();
