<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { authUser } from '$lib/stores/auth';
  import type { Channel } from '$lib/types/pb';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let channels = $state<Channel[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  const visibleChannels = $derived(
    channels.filter((ch) => {
      if (ch.is_archived) return false;
      if ($authUser?.role === 'admin') return true;
      if (!ch.required_tag) return true;
      return $authUser?.tags?.includes(ch.required_tag);
    })
  );

  onMount(async () => {
    try {
      channels = await pb.collection('channels').getFullList({ sort: '-created' });
    } catch (err: unknown) {
      error = err instanceof Error ? err.message : 'Failed to load channels';
    } finally {
      loading = false;
    }
  });
</script>

<aside class="w-64 bg-base-200 border-r border-base-300 h-screen flex flex-col">
  <div class="p-4 border-b border-base-300">
    <h2 class="text-lg font-bold text-on-base-200">Community</h2>
  </div>

  <nav class="flex-1 overflow-y-auto p-3 space-y-1">
    {#if loading}
      <div class="p-3 text-center text-base-400 animate-pulse">Loading...</div>
    {:else if error}
      <div class="p-3 text-center text-error-500">{error}</div>
    {:else if visibleChannels.length === 0}
      <div class="p-3 text-center text-base-400">No channels available</div>
    {:else}
      {#each visibleChannels as channel (channel.id)}
        <button
          type="button"
          onclick={() => goto(`/channel/${channel.slug}`)}
          class="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-base-300/50 transition text-left group"
        >
          <span class="truncate text-on-base-200 group-hover:text-primary-400">{channel.name}</span>
        </button>
      {/each}
    {/if}
  </nav>

  <div class="p-3 border-t border-base-300">
    <button
      type="button"
      onclick={() => goto('/profile')}
      class="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-base-300/50 transition"
    >
      <div
        class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-primary-950 font-bold"
      >
        {$authUser?.business_name?.charAt(0) || 'U'}
      </div>
      <div class="truncate text-sm font-medium text-on-base-200">
        {$authUser?.business_name || 'User'}
      </div>
    </button>
  </div>
</aside>
