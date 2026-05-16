<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { authUser } from '$lib/stores/auth';
  import { createOfflineMessage } from '$lib/stores/queue';
  import { invalidateAll } from '$app/navigation';

  let { conversationId, channelId = '', onSent = () => {} }: {
    conversationId?: string;
    channelId?: string;
    onSent?: () => void;
  } = $props();

  let messageText = $state('');
  let sending = $state(false);

  async function sendMessage() {
    const targetId = conversationId || channelId;
    if (!messageText.trim() || !targetId || sending) return;
    sending = true;

    const user = $authUser;
    if (!user) {
      sending = false;
      return;
    }

    const newMessage = {
      conversation: conversationId ?? '',
      sender: user.id,
      text: messageText.trim(),
      is_read: false
    };

    try {
      if (conversationId) {
        await pb.collection('dm_messages').create(newMessage);
      } else if (channelId) {
        await pb.collection('messages').create({
          channel: channelId,
          author: user.id,
          content: messageText.trim()
        });
      }
      messageText = '';
      onSent();
      invalidateAll();
    } catch (err) {
      console.error('Failed to send message, saving offline:', err);
      await createOfflineMessage(newMessage as any, 'dm_messages');
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
      onkeydown={handleKeydown}
      placeholder="Type a message..."
      class="flex-1 resize-y min-h-[44px] max-h-32 p-3 rounded-xl border border-surface-300 focus:border-primary-500 focus:outline-none"
      disabled={sending}
    ></textarea>
    <button
      onclick={sendMessage}
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
