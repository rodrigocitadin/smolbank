<script lang="ts">
	import { authState } from '$lib/auth.svelte';
	import { env } from '$env/dynamic/public';
	import type { MsgState } from '$lib/types';

	let amount = $state<string>('');
	let msg = $state<MsgState>({ text: '', error: false });
	let isSubmitting = $state<boolean>(false);

	async function handleDeposit(e: Event) {
		e.preventDefault();
		isSubmitting = true;
		msg = { text: '', error: false };

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

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Deposit failed');

			msg = { text: 'Deposit successful!', error: false };

			authState.setBalance(authState.balance + Number(amount));
			amount = '';
		} catch (err: unknown) {
			msg = { text: err instanceof Error ? err.message : 'Unknown error', error: true };
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="flex flex-col gap-4 pb-10">
	<h2 class="text-sm font-bold tracking-wider text-gray-500 uppercase">Add Funds</h2>

	<!-- {#if msg.text} -->
	<!-- 	<div -->
	<!-- 		class="mb-6 rounded-xl p-4 text-sm font-bold {msg.error -->
	<!-- 			? 'bg-red-50 text-red-600' -->
	<!-- 			: 'bg-green-50 text-green-600'}" -->
	<!-- 	> -->
	<!-- 		{msg.text} -->
	<!-- 	</div> -->
	<!-- {/if} -->

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
