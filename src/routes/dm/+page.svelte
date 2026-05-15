<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { authUser } from '$lib/stores/auth';
  import ChannelSidebar from '$lib/components/ChannelSidebar.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let conversations = $state<Record<string, unknown>[]>([]);
  let loading = $state(true);

  onMount(() => {
    if (!$authUser) return;

    (async () => {
      try {
        const res = await pb.collection('conversations').getList(1, 50, {
          filter: `participants ?~ "${$authUser.id}"`,
          sort: '-updated',
          expand: 'participants'
        });
        conversations = res.items;
      } catch (err) {
        console.error('Failed to load DMs:', err);
      } finally {
        loading = false;
      }
    })();
  });
</script>

<div class="flex min-h-screen bg-base-100">
  <ChannelSidebar />
  <main class="flex-1 p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-on-base-100">Direct Messages</h1>
      <button
        type="button"
        onclick={() => goto('/dm')}
        class="px-4 py-2 bg-primary-500 text-primary-950 rounded-lg font-medium hover:bg-primary-400 transition"
      >
        Refresh
      </button>
    </div>

    {#if loading}
      <p class="text-base-400 animate-pulse">Loading conversations...</p>
    {:else if conversations.length === 0}
      <div class="text-center py-12 bg-base-200 rounded-xl border border-base-300">
        <p class="text-base-400 mb-2">No active conversations</p>
        <p class="text-sm text-base-500">Ask an admin to start a conversation with you</p>
      </div>
    {:else}
      <div class="grid gap-3">
        {#each conversations as conv (conv.id)}
          <button
            type="button"
            onclick={() => goto(`/dm/${conv.id}`)}
            class="w-full flex items-center justify-between p-4 bg-base-200 hover:bg-base-300/50 border border-base-300 rounded-xl transition text-left"
          >
            <div>
              <p class="font-medium text-on-base-100">
                Conversation {conv.id}
              </p>
              <p class="text-sm text-base-400 truncate max-w-xs">
                {conv.last_message || 'No messages yet'}
              </p>
            </div>
            <span class="text-xs text-base-500">
              {conv.updated ? new Date(String(conv.updated)).toLocaleDateString() : ''}
            </span>
          </button>
        {/each}
      </div>
    {/if}
  </main>
</div>
