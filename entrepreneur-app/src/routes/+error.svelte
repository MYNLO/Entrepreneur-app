<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  $: status = $page.status;
  $: message = $page.error?.message || 'An unexpected error occurred';
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-surface-100 p-4 text-center">
  <div class="text-6xl mb-4">⚠️</div>
  <h1 class="text-3xl font-bold text-surface-950 mb-2">{status} Error</h1>
  <p class="text-surface-400 mb-6 max-w-md">{message}</p>
  <div class="flex gap-3">
    <button on:click={() => goto('/')} class="px-4 py-2 bg-primary-500 text-primary-950 rounded-lg font-medium hover:bg-primary-400 transition">Go Home</button>
    <button on:click={() => window.location.reload()} class="px-4 py-2 bg-surface-200 text-surface-950 rounded-lg font-medium hover:bg-surface-300 transition">Reload</button>
  </div>
</div>