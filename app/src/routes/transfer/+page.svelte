<script lang="ts">
	import { authState } from '$lib/auth.svelte';
	import { uiState } from '$lib/ui.svelte';
	import { env } from '$env/dynamic/public';

	let toAccountId = $state<string>('');
	let amount = $state<string>('');
	let isSubmitting = $state<boolean>(false);

	async function handleTransfer(e: Event) {
		e.preventDefault();
		isSubmitting = true;

		try {
			const res = await fetch(`${env.PUBLIC_API_URL}/transfer`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authState.token}`
				},
				body: JSON.stringify({
					transactionId: crypto.randomUUID(),
					fromAccountId: authState.accountId,
					toAccountId,
					amount: Number(amount)
				})
			});

			if (res.status === 401) {
				authState.logout();
				uiState.showToast('Session expired. Please log in again.', 'error');
				return;
			}

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Transfer failed');

			uiState.showToast('Transfer successfully initiated!', 'success');
			toAccountId = '';
			amount = '';

			if (data.fromBalance !== undefined) {
				authState.setBalance(data.fromBalance);
			}
		} catch (err: unknown) {
			uiState.showToast(err instanceof Error ? err.message : 'Unknown error', 'error');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="flex flex-col gap-4 pb-10">
	<h2 class="text-sm font-bold tracking-wider text-gray-500 uppercase">Send Money</h2>

	<form onsubmit={handleTransfer} class="mt-4 flex flex-col gap-3">
		<div>
			<label class="mb-1 block text-sm font-semibold text-gray-700" for="toAccountId"
				>Recipient Username</label
			>
			<div class="relative">
				<span class="absolute top-3 left-4 font-bold text-gray-400">@</span>
				<input
					id="toAccountId"
					type="text"
					bind:value={toAccountId}
					required
					placeholder="username"
					class="w-full rounded-sm border border-gray-200 bg-gray-50 p-3 pl-9 transition outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
				/>
			</div>
		</div>
		<div>
			<label class="mb-1 block text-sm font-semibold text-gray-700" for="amount">Amount</label>
			<div class="relative">
				<span class="absolute top-3 left-4 font-bold text-gray-400">$</span>
				<input
					id="amount"
					type="number"
					bind:value={amount}
					required
					min="0.01"
					step="0.01"
					placeholder="0.00"
					class="w-full rounded-sm border border-gray-200 bg-gray-50 p-3 pl-9 transition outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
				/>
			</div>
		</div>

		<button
			type="submit"
			disabled={isSubmitting}
			class="mt-4 w-full rounded-sm bg-black p-4 font-bold text-white transition-transform active:scale-[0.98] disabled:opacity-50"
		>
			{isSubmitting ? 'Sending...' : 'Send'}
		</button>
	</form>
</div>
