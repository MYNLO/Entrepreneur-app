<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { compressImage } from '$lib/utils/image';
  import { createEventDispatcher } from 'svelte';

  export let channelId: string;
  const dispatch = createEventDispatcher();

  let content = '';
  let files: File[] = [];
  let previews: string[] = [];
  let uploading = false;
  let error = '';

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      files = Array.from(input.files).slice(0, 5);
      previews = files.map(f => URL.createObjectURL(f));
    }
  }

  async function sendMessage(e: Event) {
    e.preventDefault();
    if ((!content.trim() && files.length === 0) || uploading) return;

    uploading = true;
    error = '';

    try {
      const formData = new FormData();
      formData.append('channel', channelId);
      formData.append('content', content);

      for (const file of files) {
        const compressed = await compressImage(file);
        formData.append('attachments', compressed);
      }

      await pb.collection('messages').create(formData);
      content = '';
      files = [];
      previews = [];
      (e.target as HTMLFormElement).reset();
      dispatch('sent');
    } catch (err: any) {
      error = err.message || 'Failed to send message';
    } finally {
      uploading = false;
    }
  }
</script>

<form on:submit={sendMessage} class="p-4 border-t border-surface-300 bg-surface-100">
  {#if previews.length > 0}
    <div class="flex gap-2 overflow-x-auto mb-3 pb-2">
      {#each previews as preview, i}
        <div class="relative w-20 h-20 rounded-lg overflow-hidden border border-surface-300 flex-shrink-0">
          <img src={preview} class="w-full h-full object-cover" alt="preview" />
          <button
            type="button"
            on:click={() => { files.splice(i, 1); previews.splice(i, 1); }}
            class="absolute top-0 right-0 bg-error-500/80 text-white w-5 h-5 flex items-center justify-center text-xs rounded-bl hover:bg-error-500"
          >×</button>
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
        class="w-full px-3 py-2 bg-surface-200 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-surface-950 placeholder-surface-400 resize-none min-h-[40px] max-h-[120px]"
        rows="1"
        on:keydown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(e);
          }
        }}
      />
    </label>
    <label class="cursor-pointer p-2 rounded-lg bg-surface-200 hover:bg-surface-300 transition text-surface-400">
      <input type="file" multiple accept="image/*" on:change={handleFileSelect} class="hidden" />
      📎
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