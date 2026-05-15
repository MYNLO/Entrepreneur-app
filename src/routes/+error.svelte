<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  const status = $derived(page.status);
  const message = $derived(page.error?.message || 'An unexpected error occurred');
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4 text-center">
  <div class="text-6xl mb-4" aria-hidden="true">!</div>
  <h1 class="text-3xl font-bold text-on-base-100 mb-2">{status} Error</h1>
  <p class="text-base-400 mb-6 max-w-md">{message}</p>
  <div class="flex gap-3">
    <button
      type="button"
      onclick={() => goto('/')}
      class="px-4 py-2 bg-primary-500 text-primary-950 rounded-lg font-medium hover:bg-primary-400 transition"
    >
      Go Home
    </button>
    <button
      type="button"
      onclick={() => window.location.reload()}
      class="px-4 py-2 bg-base-200 text-on-base-200 rounded-lg font-medium hover:bg-base-300 transition"
    >
      Reload
    </button>
  </div>
</div>
