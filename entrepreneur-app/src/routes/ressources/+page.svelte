<script lang="ts">
  import { pb } from '$lib/pb/client';
  import ChannelSidebar from '$lib/components/ChannelSidebar.svelte';
  import { onMount } from 'svelte';

  let resources: any[] = [];
  let categories: string[] = ['All'];
  let selected = 'All';
  let loading = true;

  onMount(async () => {
    try {
      const res = await pb.collection('resources').getList(1, 100, { sort: '-created' });
      resources = res.items;
      const cats = new Set(res.items.map((r: any) => r.category).filter(Boolean));
      categories = ['All', ...Array.from(cats)];
    } finally {
      loading = false;
    }
  });

  $: filtered = selected === 'All' ? resources : resources.filter(r => r.category === selected);

  async function handleDownload(item: any) {
    try {
      await pb.collection('resources').update(item.id, { download_count: (item.download_count || 0) + 1 });
      window.open(pb.files.getUrl(item, item.file), '_blank');
    } catch (e) {
      console.error('Download failed', e);
    }
  }
</script>

<div class="flex min-h-screen bg-surface-100">
  <ChannelSidebar />
  <main class="flex-1 p-6">
    <h1 class="text-2xl font-bold text-surface-950 mb-4">Resource Library</h1>
    
    <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
      {#each categories as cat}
        <button
          on:click={() => selected = cat}
          class={`px-3 py-1.5 rounded-full text-sm font-medium transition ${selected === cat ? 'bg-primary-500 text-primary-950' : 'bg-surface-200 text-surface-950 hover:bg-surface-300'}`}
        >
          {cat}
        </button>
      {/each}
    </div>

    {#if loading}
      <p class="text-surface-400 animate-pulse">Loading resources...</p>
    {:else if filtered.length === 0}
      <p class="text-surface-400">No resources in this category.</p>
    {:else}
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each filtered as res}
          <div class="bg-surface-200 border border-surface-300 rounded-xl p-4 hover:shadow-md transition">
            <span class="text-xs font-semibold text-primary-500 uppercase tracking-wider">{res.category}</span>
            <h3 class="font-bold text-surface-950 mt-1 mb-2">{res.title}</h3>
            <p class="text-sm text-surface-400 mb-4 line-clamp-2">{res.description}</p>
            <button
              on:click={() => handleDownload(res)}
              class="w-full py-2 bg-surface-300 hover:bg-surface-400 text-surface-950 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              📥 Download ({res.download_count || 0})
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </main>
</div>