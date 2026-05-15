<script lang="ts">
  import { page } from '$app/state';
  import { pb } from '$lib/pb/client';
  import ChannelSidebar from '$lib/components/ChannelSidebar.svelte';
  import ChatInput from '$lib/components/ChatInput.svelte';
  import MessageBubble from '$lib/components/MessageBubble.svelte';
  import type { Channel, Message } from '$lib/types/pb';
  import { onMount, onDestroy, tick } from 'svelte';

  let channel = $state<Channel | null>(null);
  let messages = $state<Message[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let unsub: (() => void) | null = null;
  let messageContainer = $state<HTMLElement | undefined>();

  const slug = $derived(page.params.slug);

  async function scrollToBottom() {
    await tick();
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }

  onMount(() => {
    if (!slug) return;

    (async () => {
      loading = true;
      try {
        const loaded = await pb.collection('channels').getFirstListItem(`slug="${slug}"`);
        channel = loaded as unknown as Channel;
        const res = await pb.collection('messages').getList(1, 100, {
          filter: `channel = "${loaded.id}"`,
          sort: '-created',
          expand: 'author'
        });
        messages = res.items.reverse() as unknown as Message[];

        unsub = await pb.collection('messages').subscribe(
          '*',
          (e) => {
            if (e.action === 'create') {
              messages = [...messages, e.record as unknown as Message];
              scrollToBottom();
            }
          },
          { filter: `channel = "${loaded.id}"` }
        );

        scrollToBottom();
      } catch (err: unknown) {
        error = err instanceof Error ? err.message : 'Failed to load channel';
      } finally {
        loading = false;
      }
    })();
  });

  onDestroy(() => {
    unsub?.();
  });
</script>

<div class="flex min-h-screen bg-base-100">
  <ChannelSidebar />
  <main class="flex-1 flex flex-col h-screen">
    {#if loading}
      <div class="flex-1 flex items-center justify-center text-base-400 animate-pulse">Loading channel...</div>
    {:else if error}
      <div class="flex-1 flex items-center justify-center text-error-500 p-4 text-center">{error}</div>
    {:else if channel}
      <header class="p-4 border-b border-base-300 bg-base-200 flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold text-on-base-200">{channel.name}</h1>
          {#if channel.description}
            <p class="text-sm text-base-400 mt-1">{channel.description}</p>
          {/if}
        </div>
        <span class="text-xs text-base-400">Realtime active</span>
      </header>

      <div bind:this={messageContainer} class="flex-1 overflow-y-auto p-2 space-y-2 scroll-smooth">
        {#each messages as msg (msg.id)}
          <MessageBubble message={msg} />
        {/each}
      </div>

      <ChatInput channelId={channel.id} onsent={scrollToBottom} />
    {/if}
  </main>
</div>
