<script lang="ts">
  import { pb } from '$lib/pb/client';
  import { goto } from '$app/navigation';

  let { isOpen = $bindable(false) }: { isOpen?: boolean } = $props();

  function handleLogout() {
    pb.authStore.clear();
    goto('/login');
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="lock-title"
  >
    <div class="bg-base-100 border border-base-300 rounded-xl max-w-md w-full p-6 shadow-2xl">
      <div class="flex justify-center mb-4 text-4xl" aria-hidden="true">&#128274;</div>
      <h2 id="lock-title" class="text-xl font-bold text-center mb-2">Subscription Inactive</h2>
      <p class="text-base-300 text-center mb-6">
        Your access to the entrepreneur community has been paused.
      </p>

      <div class="bg-surface-200/50 border border-base-300 rounded-lg p-4 mb-6">
        <p class="text-sm font-medium mb-1">To restore access:</p>
        <ol class="text-sm text-base-300 list-decimal list-inside space-y-1 mb-3">
          <li>Complete your payment via your agreed method</li>
          <li>Email confirmation to:</li>
        </ol>
        <a
          href="mailto:admin@yourcommunity.com"
          class="block text-center font-mono text-primary-500 hover:text-primary-400 hover:underline"
        >
          admin@yourcommunity.com
        </a>
      </div>

      <button
        type="button"
        onclick={handleLogout}
        class="w-full bg-primary-500 hover:bg-primary-400 text-primary-950 font-medium py-2.5 rounded-lg transition"
      >
        Return to Login
      </button>
    </div>
  </div>
{/if}
