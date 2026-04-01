<script lang="ts">
	import { authState } from '$lib/auth.svelte';
	import { uiState } from '$lib/ui.svelte';
	import { env } from '$env/dynamic/public';
	import type { TransactionRecord, DashboardResponse } from '$lib/types';

	let isLoginMode = $state<boolean>(true);
	let accountId = $state<string>('');
	let password = $state<string>('');
	let isAuthLoading = $state<boolean>(false);

	let transactions = $state<TransactionRecord[]>([]);
	let isDashLoading = $state<boolean>(false);

	let nextCursor = $state<number | undefined>(undefined);
	let isLoadingMore = $state<boolean>(false);

	async function handleAuth(e: Event) {
		e.preventDefault();
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
				uiState.showToast('Successfully logged in!', 'success');
			} else {
				isLoginMode = true;
				password = '';
				uiState.showToast('Account created! Please sign in.', 'success');
			}
		} catch (err: unknown) {
			uiState.showToast(err instanceof Error ? err.message : 'An unknown error occurred', 'error');
		} finally {
			isAuthLoading = false;
		}
	}

	async function fetchDashboard(cursor?: number) {
		if (!authState.token) return;

		if (cursor) isLoadingMore = true;
		else isDashLoading = true;

		try {
			const url = cursor
				? `${env.PUBLIC_API_URL}/account?cursor=${cursor}`
				: `${env.PUBLIC_API_URL}/account`;

			const res = await fetch(url, {
				headers: { Authorization: `Bearer ${authState.token}` }
			});

			if (res.status === 401) {
				authState.logout();
				uiState.showToast('Session expired. Please log in again.', 'error');
				return;
			}

			const data = await res.json();

			if (res.ok) {
				const dashData = data as DashboardResponse;
				authState.setBalance(dashData.balance);

				if (cursor) {
					transactions = [...transactions, ...(dashData.transactions || [])];
				} else {
					transactions = dashData.transactions || [];
				}
				nextCursor = dashData.nextCursor;
			} else {
				const errorData = data as { error?: string };
				throw new Error(errorData.error || 'Failed to load dashboard');
			}
		} catch (e: unknown) {
			uiState.showToast(e instanceof Error ? e.message : 'Connection error', 'error');
		} finally {
			isDashLoading = false;
			isLoadingMore = false;
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

			<form onsubmit={handleAuth} class="flex flex-col gap-5">
				<div>
					<label class="mb-1 block text-sm font-semibold text-gray-700" for="accountId"
						>Username</label
					>
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
					<label class="mb-1 block text-sm font-semibold text-gray-700" for="password"
						>Password</label
					>
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
		<h2 class="mb-4 text-sm font-bold tracking-wider text-gray-500 uppercase">Recent Activity</h2>

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
								{tx.type === 'DEPOSITED'
									? 'Deposit'
									: tx.counterparty === 'EXTERNAL'
										? 'System'
										: `@${tx.counterparty}`}
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

						<div class="flex flex-col items-end">
							<p
								class="text-lg font-extrabold {tx.status === 'REFUNDED'
									? 'text-gray-400 line-through'
									: tx.type === 'SENT'
										? 'text-red-600'
										: 'text-green-600'}"
							>
								{tx.status !== 'REFUNDED' ? (tx.type === 'SENT' ? '-' : '+') : null}
								${tx.amount.toFixed(2)}
							</p>

							<p
								class="mt-1 text-xs font-bold {tx.status === 'PENDING'
									? 'text-yellow-600'
									: 'text-gray-500'}"
							>
								{tx.status}
							</p>
						</div>
					</div>
				{/each}

				{#if nextCursor}
					<button
						onclick={() => fetchDashboard(nextCursor)}
						disabled={isLoadingMore}
						class="mt-2 w-full rounded-sm bg-gray-100 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-200 active:scale-[0.99] disabled:opacity-50"
					>
						{isLoadingMore ? 'Loading...' : 'Load More'}
					</button>
				{/if}
			</div>
		{/if}
	</div>
{/if}
