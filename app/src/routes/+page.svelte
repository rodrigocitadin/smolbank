<script lang="ts">
	import { authState } from '$lib/auth.svelte';
	import { env } from '$env/dynamic/public';
	import type { TransactionRecord, DashboardResponse } from '$lib/types';

	let isLoginMode = $state<boolean>(true);
	let accountId = $state<string>('');
	let password = $state<string>('');
	let authError = $state<string>('');
	let isAuthLoading = $state<boolean>(false);

	let transactions = $state<TransactionRecord[]>([]);
	let isDashLoading = $state<boolean>(false);

	async function handleAuth(e: Event) {
		e.preventDefault();
		authError = '';
		isAuthLoading = true;
		const endpoint = isLoginMode ? '/login' : '/account';

		try {
			const res = await fetch(`${env.PUBLIC_API_URL}${endpoint}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ accountId, password })
			});
			const data = await res.json();

			if (!res.ok) throw new Error(data.error || 'Request failed');

			if (isLoginMode) {
				authState.login(data.token, accountId);
				await fetchDashboard();
			} else {
				isLoginMode = true;
				password = '';
			}
		} catch (err: unknown) {
			authError = err instanceof Error ? err.message : 'An unknown error occurred';
		} finally {
			isAuthLoading = false;
		}
	}

	async function fetchDashboard() {
		if (!authState.token) return;
		isDashLoading = true;
		try {
			const res = await fetch(`${env.PUBLIC_API_URL}/account`, {
				headers: { Authorization: `Bearer ${authState.token}` }
			});
			const data = (await res.json()) as DashboardResponse;

			if (res.ok) {
				authState.setBalance(data.balance);
				transactions = data.transactions || [];
			} else if (res.status === 401) {
				authState.logout();
			}
		} catch (e) {
			console.error('Failed to fetch dashboard:', e);
		} finally {
			isDashLoading = false;
		}
	}

	$effect(() => {
		if (authState.token) {
			fetchDashboard();
		}
	});
</script>

{#if !authState.token}
	<div class="flex min-h-screen items-center justify-center bg-white p-6">
		<div class="w-full max-w-sm">
			<h2 class="mb-8 text-3xl font-black text-black">
				{isLoginMode ? 'Smolbank' : 'Create Account'}
			</h2>

			{#if authError}
				<div class="mb-8 rounded-sm bg-red-50 p-4 text-sm font-medium text-red-600">
					{authError}
				</div>
			{/if}

			<form onsubmit={handleAuth} class="flex flex-col gap-5">
				<div>
					<label class="mb-1 block text-sm font-semibold text-gray-700" for="accountId"
						>Username
					</label>
					<input
						id="accountId"
						type="text"
						bind:value={accountId}
						required
						placeholder="e.g., yourname"
						class="w-full rounded-sm border border-gray-200 bg-gray-50 p-3.5 transition outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-semibold text-gray-700" for="password">
						Password
					</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						required
						placeholder="••••••••"
						class="w-full rounded-sm border border-gray-200 bg-gray-50 p-3.5 transition outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
					/>
				</div>

				<button
					type="submit"
					disabled={isAuthLoading}
					class="mt-2 w-full rounded-sm bg-black p-4 font-bold text-white transition-transform active:scale-[0.98] disabled:opacity-50"
				>
					{isAuthLoading ? 'Processing...' : isLoginMode ? 'Sign In' : 'Sign Up'}
				</button>
			</form>

			<button
				onclick={() => (isLoginMode = !isLoginMode)}
				class="mt-8 w-full text-center text-sm font-medium text-gray-500 transition hover:text-black"
			>
				{isLoginMode ? 'No account? Create one.' : 'Already have an account? Sign in.'}
			</button>
		</div>
	</div>
{:else}
	<div class="flex flex-col gap-4 pb-10">
		<h2 class="text-sm font-bold tracking-wider text-gray-500 uppercase mb-4">Recent Activity</h2>

		{#if isDashLoading}
			<div class="py-10 text-center font-medium text-gray-400">Syncing...</div>
		{:else if transactions.length === 0}
			<div
				class="rounded-2xl border border-dashed border-gray-300 bg-white py-10 text-center text-gray-400"
			>
				No transaction history.
			</div>
		{:else}
			<div class="flex flex-col gap-3">
				{#each transactions as tx (tx.transactionId)}
					<div
						class="flex items-center justify-between rounded-sm border border-gray-200 p-4 transition-colors
							{tx.status === 'REFUNDED' && 'bg-gray-100 opacity-75'}"
					>
						<div class="flex flex-col">
							<p
								class="leading-tight font-bold {tx.status === 'REFUNDED'
									? 'text-gray-600'
									: 'text-gray-900'}"
							>
								{tx.type === 'DEPOSITED' ? 'Deposit' : `@${tx.counterparty}`}
							</p>
							<p class="mt-1 text-xs font-medium text-gray-500">
								{new Date(tx.timestamp).toLocaleTimeString([], {
									hour: '2-digit',
									minute: '2-digit'
								})}
								• {new Date(tx.timestamp).toLocaleDateString([], {
									day: '2-digit',
									month: '2-digit',
									year: '2-digit'
								})}
							</p>
						</div>

						<div
							class="text-lg font-extrabold {tx.status === 'REFUNDED'
								? 'text-gray-400 line-through'
								: tx.type === 'SENT'
									? 'text-red-600'
									: 'text-green-600'}"
						>
							{tx.status != 'REFUNDED' ? (tx.type === 'SENT' ? '-' : '+') : null}
							${tx.amount.toFixed(2)}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}
