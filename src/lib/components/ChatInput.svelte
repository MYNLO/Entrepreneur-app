<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { compressImage } from '$lib/utils/image';
  import { queueMessage } from '$lib/stores/queue';
  import { Paperclip } from '@lucide/svelte';

  let {
    channelId,
    conversationId,
    onsent
  }: {
    channelId?: string;
    conversationId?: string;
    onsent?: () => void;
  } = $props();

  let content = $state('');
  let files = $state<File[]>([]);
  let previews = $state<string[]>([]);
  let uploading = $state(false);
  let error = $state('');

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files) return;
    files = Array.from(input.files).slice(0, 5);
    previews.forEach((url) => URL.revokeObjectURL(url));
    previews = files.map((f) => URL.createObjectURL(f));
  }

  function removeFile(index: number) {
    URL.revokeObjectURL(previews[index]);
    files = files.filter((_, i) => i !== index);
    previews = previews.filter((_, i) => i !== index);
  }

  async function sendMessage(e?: Event) {
    e?.preventDefault();
    if ((!content.trim() && files.length === 0) || uploading) return;
    if (!channelId && !conversationId) return;

    uploading = true;
    error = '';

    const text = content.trim();

    try {
      if (!navigator.onLine && !files.length) {
        await queueMessage({ channelId, conversationId, content: text });
        content = '';
        onsent?.();
        return;
      }

      const formData = new FormData();
      formData.append('content', text);

      if (conversationId) {
        formData.append('conversation', conversationId);
        for (const file of files) {
          const compressed = await compressImage(file);
          formData.append('attachments', compressed);
        }
        await pb.collection('dm_messages').create(formData);
      } else if (channelId) {
        formData.append('channel', channelId);
        for (const file of files) {
          const compressed = await compressImage(file);
          formData.append('attachments', compressed);
        }
        await pb.collection('messages').create(formData);
      }

      content = '';
      previews.forEach((url) => URL.revokeObjectURL(url));
      files = [];
      previews = [];
      onsent?.();
    } catch (err: unknown) {
      if (!files.length && text) {
        try {
          await queueMessage({ channelId, conversationId, content: text });
          content = '';
          onsent?.();
          return;
        } catch {
          /* fall through */
        }
      }
      error = err instanceof Error ? err.message : 'Failed to send message';
    } finally {
      uploading = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
</script>

<form onsubmit={sendMessage} class="p-4 border-t border-base-300 bg-base-100">
  {#if previews.length > 0}
    <div class="flex gap-2 overflow-x-auto mb-3 pb-2">
      {#each previews as preview, i (preview)}
        <div class="relative w-20 h-20 rounded-lg overflow-hidden border border-base-300 shrink-0">
          <img src={preview} alt="Preview" class="w-full h-full object-cover" />
          <button
            type="button"
            onclick={() => removeFile(i)}
            class="absolute top-0 right-0 bg-error-500/80 text-white w-5 h-5 flex items-center justify-center text-xs rounded-bl hover:bg-error-500"
            aria-label="Remove image"
          >
            ×
          </button>
        </div>
      {/each}
    </div>
  {/if}

  {#if error}
    <p class="text-error-500 text-sm mb-2">{error}</p>
  {/if}

  <div class="flex gap-2 items-end">
    <label class="flex-1">
      <textarea
        bind:value={content}
        placeholder="Type a message... (Markdown supported)"
        class="w-full px-3 py-2 bg-base-200 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-on-base-100 placeholder-base-400 resize-none min-h-[40px] max-h-[120px]"
        rows="1"
        onkeydown={handleKeydown}
      ></textarea>
    </label>
    <label
      class="cursor-pointer p-2 rounded-lg bg-base-200 hover:bg-base-300 transition text-on-base-300"
      aria-label="Attach images"
    >
      <input type="file" multiple accept="image/*" onchange={handleFileSelect} class="hidden" />
      <Paperclip size={20} />
    </label>
    <button
      type="submit"
      disabled={uploading}
      class="px-4 py-2 bg-primary-500 hover:bg-primary-400 disabled:opacity-50 text-primary-950 font-medium rounded-lg transition"
    >
      {uploading ? 'Uploading...' : 'Send'}
    </button>
  </div>
</form>
