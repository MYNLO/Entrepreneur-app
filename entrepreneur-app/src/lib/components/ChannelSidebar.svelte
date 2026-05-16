<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { authUser } from '$lib/stores/auth';
  import type { Channel } from '$lib/types/pb';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let channels: Channel[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      channels = await pb.collection('channels').getFullList({ sort: '-created' });
    } catch (err: any) {
      error = err.message || 'Failed to load channels';
    } finally {
      loading = false;
    }
  });

  $: visibleChannels = channels.filter(ch => {
    if (ch.is_archived) return false;
    if ($authUser?.role === 'admin') return true;
    if (!ch.required_tag) return true;
    return $authUser?.tags?.includes(ch.required_tag);
  });
</script>

<aside class="w-64 bg-surface-200 border-r border-surface-300 h-screen flex flex-col">
  <div class="p-4 border-b border-surface-300">
    <h2 class="text-lg font-bold text-surface-950">Community</h2>
  </div>

  <nav class="flex-1 overflow-y-auto p-3 space-y-1">
    {#if loading}
      <div class="p-3 text-center text-surface-400 animate-pulse">Loading...</div>
    {:else if error}
      <div class="p-3 text-center text-error-500">{error}</div>
    {:else if visibleChannels.length === 0}
      <div class="p-3 text-center text-surface-400">No channels available</div>
    {:else}
      {#each visibleChannels as channel}
        <button
          on:click={() => goto(`/channel/${channel.slug}`)}
          class="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-300/50 transition text-left group"
        >
          <span class="truncate text-surface-950 group-hover:text-primary-400">{channel.name}</span>
          <span class="ml-2 hidden"></span>
        </button>
      {/each}
    {/if}
  </nav>

  <div class="p-3 border-t border-surface-300">
    <button on:click={() => goto('/profile')} class="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-300/50 transition">
      <div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-primary-950 font-bold">
        {$authUser?.business_name?.charAt(0) || 'U'}
      </div>
      <div class="truncate text-sm font-medium text-surface-950">
        {$authUser?.business_name || 'User'}
      </div>
    </button>
  </div>
</aside>