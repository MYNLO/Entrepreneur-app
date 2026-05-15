<script lang="ts">
  import '../app.css';
  import { authUser, isSubActive } from '$lib/stores/auth';
  import SubscriptionLockModal from '$lib/components/SubscriptionLockModal.svelte';
  import VersionBanner from '$lib/components/VersionBanner.svelte';
  import { setupOfflineSync } from '$lib/stores/queue';
  import { onMount } from 'svelte';

  let { children } = $props();

  let showLock = $state(false);

  onMount(() => {
    setupOfflineSync();

    const checkSub = () => {
      if ($authUser && !$isSubActive) {
        showLock = true;
      }
    };

    checkSub();
    const interval = setInterval(checkSub, 300_000);
    return () => clearInterval(interval);
  });
</script>

<VersionBanner currentVersion={import.meta.env.VITE_APP_VERSION || '1.0.0'} />

<div class="min-h-screen flex flex-col">
  {@render children()}
  <SubscriptionLockModal bind:isOpen={showLock} />
</div>
