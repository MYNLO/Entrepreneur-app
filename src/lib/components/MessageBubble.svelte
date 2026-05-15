<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { renderMarkdown } from '$lib/utils/markdown';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import type { Message } from '$lib/types/pb';

  dayjs.extend(relativeTime);

  let { message }: { message: Message & { author?: { business_name?: string; username?: string } } } =
    $props();

  const safeHtml = $derived(renderMarkdown(message.content));
  const hasAttachments = $derived((message.attachments?.length ?? 0) > 0);
  const timeAgo = $derived(dayjs(message.created).fromNow());
  const initials = $derived(
    (message.author?.business_name || message.author?.username || 'U').charAt(0).toUpperCase()
  );
</script>

<div class="max-w-3xl mx-auto py-2 px-4 hover:bg-base-200/50 transition rounded-lg group">
  <div class="flex items-start gap-3">
    <div
      class="w-8 h-8 rounded-full bg-primary-500/20 text-primary-500 flex items-center justify-center font-bold text-sm shrink-0"
    >
      {initials}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <span class="font-medium text-on-base-200">{message.author?.business_name || 'Unknown'}</span>
        <span class="text-xs text-base-400">{timeAgo}</span>
      </div>

      {#if safeHtml}
        <div class="prose prose-sm dark:prose-invert max-w-none mb-2">{@html safeHtml}</div>
      {/if}

      {#if hasAttachments}
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {#each message.attachments as img (img)}
            <a
              href={pb.files.getUrl(message, img)}
              target="_blank"
              rel="noopener noreferrer"
              class="block overflow-hidden rounded-lg border border-base-300 hover:border-primary-400 transition"
            >
              <img
                src={pb.files.getUrl(message, img)}
                alt="Attachment"
                class="w-full h-32 object-cover hover:scale-105 transition-transform"
              />
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
