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
				alert('Account created! Please sign in.');
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
	<div class="flex min-h-screen items-center justify-center bg-gray-50 p-6">
		<div class="w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
			<h2 class="mb-8 text-center text-2xl font-black tracking-tight text-gray-900">
				{isLoginMode ? 'SmolBank' : 'Create Account'}
			</h2>

			{#if authError}
				<div class="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
					{authError}
				</div>
			{/if}

			<form onsubmit={handleAuth} class="flex flex-col gap-5">
				<div>
					<label class="mb-1.5 block text-sm font-semibold text-gray-700" for="accountId"
						>Username</label
					>
					<input
						id="accountId"
						type="text"
						bind:value={accountId}
						required
						placeholder="e.g., yourname"
						class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 transition outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
					/>
				</div>
				<div>
					<label class="mb-1.5 block text-sm font-semibold text-gray-700" for="password"
						>Password</label
					>
					<input
						id="password"
						type="password"
						bind:value={password}
						required
						placeholder="••••••••"
						class="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 transition outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
					/>
				</div>

				<button
					type="submit"
					disabled={isAuthLoading}
					class="mt-2 w-full rounded-xl bg-black p-4 font-bold text-white transition-transform active:scale-[0.98] disabled:opacity-50"
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
		<h2 class="px-1 text-sm font-bold tracking-wider text-gray-500 uppercase">Recent Activity</h2>

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
						class="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
					>
						<div class="flex items-center gap-4">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold {tx.type ===
								'SEND'
									? 'bg-red-50 text-red-500'
									: 'bg-green-50 text-green-500'}"
							>
								{tx.type === 'SEND' ? '↑' : '↓'}
							</div>
							<div>
								<p class="leading-tight font-bold text-gray-900">
									{tx.type === 'DEPOSIT'
										? 'Deposit'
										: tx.counterparty === 'EXTERNAL'
											? 'System'
											: `@${tx.counterparty}`}
								</p>
								<p class="mt-0.5 text-xs font-medium text-gray-400">
									{new Date(tx.timestamp).toLocaleTimeString([], {
										hour: '2-digit',
										minute: '2-digit'
									})}
									• {new Date(tx.timestamp).toLocaleDateString()}
								</p>
								{#if tx.status !== 'COMPLETED'}
									<p
										class="mt-1 text-xs font-bold {tx.status === 'PENDING'
											? 'text-yellow-500'
											: 'text-red-500'}"
									>
										{tx.status}
									</p>
								{/if}
							</div>
						</div>
						<div
							class="text-lg font-black {tx.type === 'SEND' ? 'text-gray-900' : 'text-green-500'}"
						>
							{tx.type === 'SEND' ? '-' : '+'} ${tx.amount.toFixed(2)}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}
