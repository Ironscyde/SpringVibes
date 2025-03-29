<script lang="ts">
	import { onMount } from 'svelte';
	import { ArticleService } from '$lib/services/articleService';
	import { Logger } from '$lib/utils/logger';

	interface Article {
		title: string;
		url: string;
		date: string;
		factions: string[];
	}

	const factionData = [
		{
			id: 'leagues-of-votann',
			title: 'Leagues of Votann',
			description: 'Latest news about the mighty Leagues of Votann:'
		},
		{
			id: 'adeptus-custodes',
			title: 'Adeptus Custodes',
			description: 'Recent updates for the Emperor\'s finest guardians:'
		},
		{
			id: 'orks',
			title: 'Orks',
			description: 'WAAAGH! Latest Ork news:'
		},
		{
			id: 'mission-pack',
			title: 'Mission Packs',
			description: 'Latest mission packs and battle scenarios for Warhammer 40,000 10th Edition:'
		},
		{
			id: 'errata',
			title: 'Errata & FAQs',
			description: 'Official errata and frequently asked questions for Warhammer 40,000 10th Edition:'
		},
		{
			id: 'rules-update',
			title: 'Rules Updates',
			description: 'Core rules updates and changes for Warhammer 40,000 10th Edition:'
		}
	];

	let articlesByFaction: Record<string, Article[]> = {};
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const articleData: Record<string, Article[]> = {};
			
			for (const faction of factionData) {
				const articles = await ArticleService.getArticlesByFaction(faction.id);
				articleData[faction.id] = articles;
			}
			
			articlesByFaction = articleData;
		} catch (err) {
			Logger.error('Error fetching articles:', err);
			error = 'Failed to load articles. Please try again later.';
		} finally {
			loading = false;
		}
	});
</script>

<div class="max-w-4xl mx-auto py-8 px-4">
	<h1 class="text-4xl font-bold mb-8">Warhammer 40,000 News</h1>
	
	{#if loading}
		<div class="flex justify-center items-center min-h-[200px]">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
		</div>
	{:else if error}
		<div class="flex justify-center items-center min-h-[200px]">
			<div class="text-red-500">{error}</div>
		</div>
	{:else}
		<div class="space-y-12">
			{#each factionData as faction}
				<section class="border rounded-lg p-6 shadow-sm">
					<h2 class="text-2xl font-semibold mb-4">{faction.title}</h2>
					<p class="text-gray-700 mb-4">{faction.description}</p>
					
					<div class="space-y-4">
						{#if articlesByFaction[faction.id]?.length > 0}
							{#each articlesByFaction[faction.id] as article}
								<a
									href={article.url}
									target="_blank"
									rel="noopener noreferrer"
									class="block p-4 border rounded hover:bg-gray-50 transition-colors"
								>
									<h3 class="font-medium">{article.title}</h3>
									<p class="text-sm text-gray-500">{article.date}</p>
								</a>
							{/each}
						{:else}
							<p class="text-gray-500 italic">No recent articles found</p>
						{/if}
					</div>
				</section>
			{/each}
		</div>
	{/if}
</div>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		color: #c41e3a;
		text-align: center;
		margin-bottom: 2rem;
	}

	section {
		margin-bottom: 2rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 8px;
	}

	h2 {
		color: #c41e3a;
		margin-bottom: 1rem;
	}

	ul, ol {
		margin-left: 1.5rem;
	}

	li {
		margin-bottom: 0.5rem;
	}

	p {
		line-height: 1.6;
		margin-bottom: 1rem;
	}
</style> 