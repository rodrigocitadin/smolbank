<script lang="ts">
	import './layout.css';
	import { authState } from '$lib/auth.svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

{#if !authState.token}
	{@render children()}
{:else}
	<div class="flex min-h-screen flex-col bg-white text-black">
		<header
			class="bg-slate-white z-10 flex items-start justify-between border-b border-gray-200 px-5 py-4"
		>
			<div class="flex flex-col">
				<span class="text-sm font-medium text-gray-500">@{authState.accountId}</span>
				<span class="text-2xl font-bold text-black">${authState.balance.toFixed(2)}</span>
			</div>

			<button
				onclick={() => authState.logout()}
				class="rounded-sm bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition active:bg-red-100"
			>
				Sign Out
			</button>
		</header>

		<nav class="hide-scrollbar flex gap-3 overflow-x-auto bg-white px-4 py-3 whitespace-nowrap">
			<a
				href={resolve('/')}
				class="rounded-sm px-5 py-3 text-sm font-semibold transition {page.url.pathname === '/'
					? 'bg-black text-white'
					: 'bg-gray-100 text-black'}"
			>
				Dashboard
			</a>
			<a
				href={resolve('/transfer')}
				class="rounded-sm px-5 py-3 text-sm font-semibold transition {page.url.pathname ===
				'/transfer'
					? 'bg-black text-white'
					: 'bg-gray-100 text-black'}"
			>
				Transfer
			</a>
			<a
				href={resolve('/deposit')}
				class="rounded-sm px-5 py-3 text-sm font-semibold transition {page.url.pathname ===
				'/deposit'
					? 'bg-black text-white'
					: 'bg-gray-100 text-black'}"
			>
				Deposit
			</a>
		</nav>

		<main class="flex-1 overflow-y-auto p-4">
			{@render children()}
		</main>
	</div>
{/if}

<style>
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.hide-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
