<script lang="ts">
  import { authUser, isSubActive } from '$lib/stores/auth';
  import SubscriptionLockModal from '$lib/components/SubscriptionLockModal.svelte';
  import { onMount } from 'svelte';

  let showLock = false;

  onMount(() => {
    const checkSub = () => {
      if ($authUser && !$isSubActive) {
        showLock = true;
      }
    };
    checkSub();
    const interval = setInterval(checkSub, 300000); // 5 min heartbeat
    return () => clearInterval(interval);
  });
</script>

<div class="min-h-screen flex flex-col">
  <slot />
  <SubscriptionLockModal bind:isOpen={showLock} />
</div>