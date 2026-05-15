<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { onMount } from 'svelte';

  let { currentVersion = '1.0.0' }: { currentVersion?: string } = $props();

  let show = $state(false);
  let downloadUrl = $state('');

  onMount(async () => {
    try {
      const settings = await pb.collection('app_settings').getFirstListItem('version != ""');
      if (settings.version !== currentVersion) {
        show = true;
        downloadUrl = settings.download_url || '#';
      }
    } catch {
      /* settings collection optional */
    }
  });
</script>

{#if show}
  <div
    class="w-full bg-primary-500 text-primary-950 px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2"
  >
    <span>New version available</span>
    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" class="underline hover:text-primary-700">
      Download Update
    </a>
  </div>
{/if}
