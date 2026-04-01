<script lang="ts">
	import { authState } from '$lib/auth.svelte';
	import { env } from '$env/dynamic/public';
	import type { MsgState } from '$lib/types';

	let toAccountId = $state<string>('');
	let amount = $state<string>('');
	let msg = $state<MsgState>({ text: '', error: false });
	let isSubmitting = $state<boolean>(false);

	async function handleTransfer(e: Event) {
		e.preventDefault();
		isSubmitting = true;
		msg = { text: '', error: false };

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

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Transfer failed');

			msg = { text: 'Transfer successfully initiated!', error: false };
			toAccountId = '';
			amount = '';

			if (data.fromBalance !== undefined) {
				authState.setBalance(data.fromBalance);
			}
		} catch (err: unknown) {
			msg = { text: err instanceof Error ? err.message : 'Unknown error', error: true };
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
	<h2 class="mb-6 text-xl font-black text-gray-900">Send Money</h2>

	{#if msg.text}
		<div
			class="mb-6 rounded-xl p-4 text-sm font-bold {msg.error
				? 'bg-red-50 text-red-600'
				: 'bg-green-50 text-green-600'}"
		>
			{msg.text}
		</div>
	{/if}

	<form onsubmit={handleTransfer} class="flex flex-col gap-5">
		<div>
			<label class="mb-1.5 block text-sm font-semibold text-gray-700" for="toAccountId"
				>Recipient Username</label
			>
			<div class="relative">
				<span class="absolute top-3.5 left-4 font-bold text-gray-400">@</span>
				<input
					id="toAccountId"
					type="text"
					bind:value={toAccountId}
					required
					placeholder="username"
					class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 pl-9 transition outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
				/>
			</div>
		</div>
		<div>
			<label class="mb-1.5 block text-sm font-semibold text-gray-700" for="amount">Amount</label>
			<div class="relative">
				<span class="absolute top-3.5 left-4 font-bold text-gray-400">$</span>
				<input
					id="amount"
					type="number"
					bind:value={amount}
					required
					min="0.01"
					step="0.01"
					placeholder="0.00"
					class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 pl-11 transition outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
				/>
			</div>
		</div>

		<button
			type="submit"
			disabled={isSubmitting}
			class="mt-4 w-full rounded-xl bg-black p-4 font-bold text-white transition-transform active:scale-[0.98] disabled:opacity-50"
		>
			{isSubmitting ? 'Sending...' : 'Send'}
		</button>
	</form>
</div>
