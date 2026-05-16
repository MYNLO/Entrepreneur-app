<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { authUser } from '$lib/stores/auth';
  import { createOfflineMessage } from '$lib/stores/queue';
  import { invalidateAll } from '$app/navigation';

  export let conversationId: string;
  export let onSent: () => void = () => {};

  let messageText = '';
  let sending = false;

  async function sendMessage() {
    if (!messageText.trim() || !conversationId || sending) return;
    sending = true;

    const user = $authUser;
    if (!user) {
      sending = false;
      return;
    }

    const newMessage = {
      conversation: conversationId,
      sender: user.id,
      text: messageText.trim(),
      is_read: false
    };

    try {
      await pb.collection('dm_messages').create(newMessage);
      messageText = '';
      onSent();
      invalidateAll();
    } catch (err) {
      console.error('Failed to send DM, saving offline:', err);
      await createOfflineMessage(newMessage, 'dm_messages');
      messageText = '';
      onSent();
    } finally {
      sending = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
</script>

<div class="border-t border-surface-300 bg-surface-100 p-3">
  <div class="flex gap-2">
    <textarea
      bind:value={messageText}
      on:keydown={handleKeydown}
      placeholder="Type a message..."
      class="flex-1 resize-y min-h-[44px] max-h-32 p-3 rounded-xl border border-surface-300 focus:border-primary-500 focus:outline-none"
      disabled={sending}
    />
    <button
      on:click={sendMessage}
      disabled={sending || !messageText.trim()}
      class="px-6 bg-primary-600 hover:bg-primary-700 disabled:bg-surface-300 text-white rounded-xl font-medium transition-colors"
    >
      {sending ? 'Sending...' : 'Send'}
    </button>
  </div>
  <p class="text-[10px] text-surface-400 mt-1.5 text-center">
    Messages are end-to-end encrypted in this community
  </p>
</div>