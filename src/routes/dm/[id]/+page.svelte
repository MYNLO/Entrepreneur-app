<script lang="ts">
  import { page } from '$app/state';
  import { pb } from '$lib/pb/client';
  import ChannelSidebar from '$lib/components/ChannelSidebar.svelte';
  import ChatInput from '$lib/components/ChatInput.svelte';
  import MessageBubble from '$lib/components/MessageBubble.svelte';
  import type { Message } from '$lib/types/pb';
  import { onMount, onDestroy, tick } from 'svelte';

  let conv = $state<Record<string, unknown> | null>(null);
  let messages = $state<Message[]>([]);
  let loading = $state(true);
  let unsub: (() => void) | null = null;
  let scrollEl = $state<HTMLElement | undefined>();

  const id = $derived(page.params.id);

  async function scrollToBottom() {
    await tick();
    if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
  }

  onMount(() => {
    if (!id) return;

    (async () => {
      loading = true;
      try {
        conv = await pb.collection('conversations').getOne(id, { expand: 'participants' });
        const res = await pb.collection('dm_messages').getList(1, 100, {
          filter: `conversation = "${id}"`,
          sort: '-created',
          expand: 'author'
        });
        messages = res.items.reverse() as unknown as Message[];

        unsub = await pb.collection('dm_messages').subscribe(
          '*',
          (e) => {
            if (e.action === 'create') {
              messages = [...messages, e.record as unknown as Message];
              scrollToBottom();
            }
          },
          { filter: `conversation = "${id}"` }
        );

        scrollToBottom();
      } catch (err) {
        console.error(err);
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
      <div class="flex-1 flex items-center justify-center text-base-400">Loading DM...</div>
    {:else if conv}
      <header class="p-4 border-b border-base-300 bg-base-200">
        <h1 class="text-xl font-bold text-on-base-100">Direct Message</h1>
      </header>
      <div bind:this={scrollEl} class="flex-1 overflow-y-auto p-2 space-y-2 scroll-smooth">
        {#each messages as msg (msg.id)}
          <MessageBubble message={msg} />
        {/each}
      </div>
      <ChatInput conversationId={id} onsent={scrollToBottom} />
    {/if}
  </main>
</div>
