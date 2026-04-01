<script lang="ts">
	import { authState } from '$lib/auth.svelte';
	import { uiState } from '$lib/ui.svelte';
	import { env } from '$env/dynamic/public';

	let amount = $state<string>('');
	let isSubmitting = $state<boolean>(false);

	async function handleDeposit(e: Event) {
		e.preventDefault();
		isSubmitting = true;

		try {
			const res = await fetch(`${env.PUBLIC_API_URL}/deposit`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					transactionId: crypto.randomUUID(),
					accountId: authState.accountId,
					amount: Number(amount)
				})
			});

			if (res.status === 401) {
				authState.logout();
				uiState.showToast('Session expired. Please log in again.', 'error');
				return;
			}

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Deposit failed');

			uiState.showToast('Deposit successful!', 'success');

			authState.setBalance(authState.balance + Number(amount));
			amount = '';
		} catch (err: unknown) {
			uiState.showToast(err instanceof Error ? err.message : 'Unknown error', 'error');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="flex flex-col gap-4 pb-10">
	<h2 class="text-sm font-bold tracking-wider text-gray-500 uppercase">Add Funds</h2>

	<form onsubmit={handleDeposit} class="mt-4 flex flex-col gap-3">
		<div>
			<label class="mb-1 block text-sm font-semibold text-gray-700" for="depAmount"
				>Amount to Deposit</label
			>
			<div class="relative">
				<span class="absolute top-3 left-4 font-bold text-gray-400">$</span>
				<input
					id="depAmount"
					type="number"
					bind:value={amount}
					required
					min="0.01"
					step="0.01"
					placeholder="0.00"
					class="w-full rounded-sm border border-gray-200 bg-gray-50 p-3 pl-9 transition outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
				/>
			</div>
			<p class="mt-2 text-xs text-gray-400">
				* In a real environment, this would open a Payment Gateway.
			</p>
		</div>

		<button
			type="submit"
			disabled={isSubmitting}
			class="mt-4 w-full rounded-sm bg-black p-4 font-bold text-white transition-transform active:scale-[0.98] disabled:opacity-50"
		>
			{isSubmitting ? 'Processing...' : 'Simulate Deposit'}
		</button>
	</form>
</div>
