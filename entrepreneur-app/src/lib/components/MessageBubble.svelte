<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { renderMarkdown } from '$lib/utils/markdown';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  dayjs.extend(relativeTime);

  export let message: any;
const safeHtml = (renderMarkdown(message.content));
const hasAttachments = (message.attachments?.length > 0);
const timeAgo = (dayjs(message.created).fromNow());
const initials = ((message.author?.business_name || message.author?.username || 'U').charAt(0).toUpperCase());
</script>

<div class="max-w-3xl mx-auto py-2 px-4 hover:bg-surface-200/50 transition rounded-lg group">
  <div class="flex items-start gap-3">
    <div class="w-8 h-8 rounded-full bg-primary-500/20 text-primary-500 flex items-center justify-center font-bold text-sm flex-shrink-0">
      {initials}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <span class="font-medium text-surface-950">{message.author?.business_name || 'Unknown'}</span>
        <span class="text-xs text-surface-400">{timeAgo}</span>
      </div>

      {#if safeHtml}
        <div class="prose prose-sm dark:prose-invert max-w-none mb-2">{@html safeHtml}</div>
      {/if}

      {#if hasAttachments}
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {#each message.attachments as img}
            <a
              href={pb.files.getUrl(message, img)}
              target="_blank"
              class="block overflow-hidden rounded-lg border border-surface-300 hover:border-primary-400 transition"
            >
              <img
                src={pb.files.getUrl(message, img)}
                alt="Attachment"
                class="w-full h-32 object-cover hover:scale-105 transition-transform"
                on:error={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>