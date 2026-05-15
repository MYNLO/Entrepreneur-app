<script lang="ts">
  import { page } from '$app/stores';
  import { pb } from '$lib/pb/client';
  import ChannelSidebar from '$lib/components/ChannelSidebar.svelte';
  import ChatInput from '$lib/components/ChatInput.svelte';
  import MessageBubble from '$lib/components/MessageBubble.svelte';
  import { onMount, onDestroy, tick } from 'svelte';

  let conv: any = null;
  let messages: any[] = [];
  let loading = true;
  let unsub: (() => void) | null = null;
  let scrollEl: HTMLElement;

  $: id = $page.params.id;

  onMount(async () => {
    if (!id) return;
    loading = true;
    try {
      conv = await pb.collection('conversations').getOne(id);
      const res = await pb.collection('dm_messages').getList(1, 100, {
        filter: `conversation = "${id}"`,
        sort: '-created'
      });
      messages = res.items.reverse();

      unsub = pb.collection('dm_messages').subscribe(id, (e) => {
        if (e.action === 'create') {
          messages = [...messages, e.record];
          tick().then(() => scrollEl.scrollTop = scrollEl.scrollHeight);
        }
      }, { filter: `conversation = "${id}"` });

      await tick();
      if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
    } catch (err: any) {
      console.error(err);
    } finally {
      loading = false;
    }
  });

  onDestroy(() => unsub?.());
</script>

<div class="flex min-h-screen bg-surface-100">
  <ChannelSidebar />
  <main class="flex-1 flex flex-col h-screen">
    {#if loading}
      <div class="flex-1 flex items-center justify-center text-surface-400">Loading DM...</div>
    {:else if conv}
      <header class="p-4 border-b border-surface-300 bg-surface-200">
        <h1 class="text-xl font-bold text-surface-950">DM with {conv.other_user?.business_name || 'Member'}</h1>
      </header>
      <div bind:this={scrollEl} class="flex-1 overflow-y-auto p-2 space-y-2 scroll-smooth">
        {#each messages as msg}
          <MessageBubble message={msg} />
        {/each}
      </div>
      <ChatInput channelId={id} on:sent={() => tick().then(() => scrollEl.scrollTop = scrollEl.scrollHeight)} />
    {/if}
  </main>
</div>