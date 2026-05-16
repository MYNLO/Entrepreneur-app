<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { goto } from '$app/navigation';

  export let isOpen = false;

  function handleLogout() {
    pb.authStore.clear();
    goto('/login');
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    <div class="bg-surface-100 border border-surface-300 rounded-xl max-w-md w-full p-6 shadow-2xl">
      <div class="flex justify-center mb-4 text-4xl">🔒</div>
      <h2 class="text-xl font-bold text-center mb-2">Subscription Inactive</h2>
      <p class="text-surface-400 text-center mb-6">
        Your access to the entrepreneur community has been paused.
      </p>

      <div class="bg-surface-200/50 border border-surface-300 rounded-lg p-4 mb-6">
        <p class="text-sm font-medium mb-1">To restore access:</p>
        <ol class="text-sm text-surface-400 list-decimal list-inside space-y-1 mb-3">
          <li>Complete your payment via your agreed method</li>
          <li>Email confirmation to:</li>
        </ol>
        <a
          href="mailto:admin@admin.com"
          class="block text-center font-mono text-primary-500 hover:text-primary-400 hover:underline"
        >
          admin@admin.com
        </a>
      </div>

      <button
        on:click={handleLogout}
        class="w-full bg-primary-500 hover:bg-primary-400 text-primary-950 font-medium py-2.5 rounded-lg transition"
      >
        Return to Login
      </button>
    </div>
  </div>
{/if}