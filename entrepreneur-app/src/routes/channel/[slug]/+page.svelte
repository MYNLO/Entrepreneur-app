<script lang="ts">
  import { page } from '$app/stores';
  import { pb } from '$lib/pb/client';
  import ChannelSidebar from '$lib/components/ChannelSidebar.svelte';
  import ChatInput from '$lib/components/ChatInput.svelte';
  import MessageBubble from '$lib/components/MessageBubble.svelte';
  import type { Channel, Message } from '$lib/types/pb';
  import { onMount, onDestroy, tick } from 'svelte';

  let channel: Channel | null = null;
  let messages: Message[] = [];
  let loading = true;
  let error: string | null = null;
  let unsub: (() => void) | null = null;
  let messageContainer: HTMLElement;
const slug = ($page.params.slug);

  async function scrollToBottom() {
    await tick();
    if (messageContainer) messageContainer.scrollTop = messageContainer.scrollHeight;
  }

  onMount(async () => {
    if (!slug) return;
    loading = true;
    try {
      channel = await pb.collection('channels').getFirstListItem(`slug="${slug}"`);
      if (!channel) return;

      const res = await pb.collection('messages').getList(1, 100, {
        filter: `channel = "${channel.id}"`,
        sort: '-created'
      });
      messages = res.items as unknown as Message[];

      const channelId = channel.id;
      const unsubFn = await pb.collection('messages').subscribe(
        channelId,
        (e) => {
          if (e.action === 'create') {
            messages = [...messages, e.record as unknown as Message];
            scrollToBottom();
          }
        },
        { filter: `channel = "${channelId}"` }
      );
      unsub = unsubFn;

      scrollToBottom();
    } catch (err: any) {
      error = err.message || 'Failed to load channel';
    } finally {
      loading = false;
    }
  });

  onDestroy(() => {
    unsub?.();
  });
</script>

<div class="flex min-h-screen bg-surface-100">
  <ChannelSidebar />
  <main class="flex-1 flex flex-col h-screen">
    {#if loading}
      <div class="flex-1 flex items-center justify-center text-surface-400 animate-pulse">Loading channel...</div>
    {:else if error}
      <div class="flex-1 flex items-center justify-center text-error-500 p-4 text-center">{error}</div>
    {:else if channel}
      <header class="p-4 border-b border-surface-300 bg-surface-200 flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-surface-950">{channel.name}</h1>
          {#if channel.description}
            <p class="text-sm text-surface-400 mt-1">{channel.description}</p>
          {/if}
        </div>
        <span class="text-xs text-surface-400">Realtime active</span>
      </header>

      <div bind:this={messageContainer} class="flex-1 overflow-y-auto p-2 space-y-2 scroll-smooth">
        {#each messages as msg}
          <MessageBubble message={msg} />
        {/each}
      </div>

      <ChatInput channelId={channel.id} onSent={scrollToBottom} />
    {/if}
  </main>
</div>
