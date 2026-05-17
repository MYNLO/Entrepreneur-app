<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { onMount } from 'svelte';

  let { currentVersion = '1.0.0' } = $props();
  let show = false;
  let downloadUrl = '';

  onMount(async () => {
    try {
      const settings = await pb.collection('_settings').getOne('app_version');
      if (settings.version !== currentVersion) {
        show = true;
        downloadUrl = settings.download_url || '#';
      }
    } catch (e) { /* Ignore if settings collection missing */ }
  });
</script>

{#if show}
  <div class="w-full bg-primary-500 text-primary-950 px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
    <span>📦 New version available</span>
    <a href={downloadUrl} target="_blank" class="underline hover:text-primary-700">Download Update</a>
  </div>
{/if}