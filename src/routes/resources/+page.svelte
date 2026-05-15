<script lang="ts">
  import { pb } from '$lib/pb/client';
  import ChannelSidebar from '$lib/components/ChannelSidebar.svelte';
  import Fuse from 'fuse.js';
  import { onMount } from 'svelte';

  let resources = $state<Record<string, unknown>[]>([]);
  let categories = $state<string[]>(['All']);
  let selected = $state('All');
  let searchQuery = $state('');
  let loading = $state(true);

  const fuse = $derived(
    new Fuse(resources, {
      keys: ['title', 'description', 'category'],
      threshold: 0.35
    })
  );

  const filtered = $derived.by(() => {
    let list =
      selected === 'All' ? resources : resources.filter((r) => r.category === selected);
    if (searchQuery.trim()) {
      list = fuse.search(searchQuery.trim()).map((r) => r.item);
    }
    return list;
  });

  onMount(async () => {
    try {
      const res = await pb.collection('resources').getList(1, 100, { sort: '-created' });
      resources = res.items;
      const cats = new Set(res.items.map((r) => r.category).filter(Boolean) as string[]);
      categories = ['All', ...Array.from(cats)];
    } finally {
      loading = false;
    }
  });

  async function handleDownload(item: Record<string, unknown>) {
    try {
      await pb.collection('resources').update(String(item.id), {
        download_count: Number(item.download_count || 0) + 1
      });
      window.open(pb.files.getUrl(item, String(item.file)), '_blank');
    } catch (e) {
      console.error('Download failed', e);
    }
  }
</script>

<div class="flex min-h-screen bg-base-100">
  <ChannelSidebar />
  <main class="flex-1 p-6">
    <h1 class="text-2xl font-bold text-on-base-100 mb-4">Resource Library</h1>

    <input
      type="search"
      bind:value={searchQuery}
      placeholder="Search resources..."
      class="w-full max-w-md mb-4 px-3 py-2 bg-base-200 border border-base-300 rounded-lg text-on-base-100 placeholder-base-400"
    />

    <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
      {#each categories as cat (cat)}
        <button
          type="button"
          onclick={() => (selected = cat)}
          class={`px-3 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${selected === cat ? 'bg-primary-500 text-primary-950' : 'bg-base-200 text-on-base-200 hover:bg-base-300'}`}
        >
          {cat}
        </button>
      {/each}
    </div>

    {#if loading}
      <p class="text-base-400 animate-pulse">Loading resources...</p>
    {:else if filtered.length === 0}
      <p class="text-base-400">No resources in this category.</p>
    {:else}
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each filtered as res (res.id)}
          <div class="bg-base-200 border border-base-300 rounded-xl p-4 hover:shadow-md transition">
            <span class="text-xs font-semibold text-primary-500 uppercase tracking-wider"
              >{res.category}</span
            >
            <h3 class="font-bold text-on-base-100 mt-1 mb-2">{res.title}</h3>
            <p class="text-sm text-base-400 mb-4 line-clamp-2">{res.description}</p>
            <button
              type="button"
              onclick={() => handleDownload(res)}
              class="w-full py-2 bg-base-300 hover:bg-base-400 text-on-base-100 rounded-lg font-medium transition"
            >
              Download ({res.download_count || 0})
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </main>
</div>
