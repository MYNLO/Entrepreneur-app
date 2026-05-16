<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { authUser } from '$lib/stores/auth';
  import ChannelSidebar from '$lib/components/ChannelSidebar.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let conversations: any[] = [];
  let loading = true;

  onMount(async () => {
    if (!$authUser) return;
    try {
      const res = await pb.collection('conversations').getList(1, 50, {
        filter: `participants ? "${$authUser.id}"`,
        sort: '-updated'
      });
      conversations = res.items;
    } catch (err) {
      console.error('Failed to load DMs:', err);
    } finally {
      loading = false;
    }
  });
</script>

<div class="flex min-h-screen bg-surface-100">
  <ChannelSidebar />
  <main class="flex-1 p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-surface-950">Direct Messages</h1>
      <button on:click={() => goto('/dm/new')} class="px-4 py-2 bg-primary-500 text-primary-950 rounded-lg font-medium hover:bg-primary-400 transition">
        Start Conversation
      </button>
    </div>

    {#if loading}
      <p class="text-surface-400 animate-pulse">Loading conversations...</p>
    {:else if conversations.length === 0}
      <div class="text-center py-12 bg-surface-200 rounded-xl border border-surface-300">
        <p class="text-surface-400 mb-2">No active conversations</p>
        <p class="text-sm text-surface-500">Click "Start Conversation" to message a member</p>
      </div>
    {:else}
      <div class="grid gap-3">
        {#each conversations as conv}
          <button
            on:click={() => goto(`/dm/${conv.id}`)}
            class="w-full flex items-center justify-between p-4 bg-surface-200 hover:bg-surface-300/50 border border-surface-300 rounded-xl transition text-left"
          >
            <div>
              <p class="font-medium text-surface-950">Conversation with {conv.other_user?.business_name || 'Member'}</p>
              <p class="text-sm text-surface-400 truncate max-w-xs">{conv.last_message || 'No messages yet'}</p>
            </div>
            <span class="text-xs text-surface-500">{new Date(conv.updated).toLocaleDateString()}</span>
          </button>
        {/each}
      </div>
    {/if}
  </main>
</div>