<script lang="ts">
  import { goto } from '$app/navigation';
  import { authUser, isSubActive } from '$lib/stores/auth';
  import { onMount } from 'svelte';

  onMount(() => {
    if (!$authUser) {
      goto('/login');
    } else if (!$isSubActive) {
      // Lock modal in layout will trigger automatically
    } else {
      goto('/channels');
    }
  });
</script>

<div class="min-h-screen flex items-center justify-center bg-surface-100 text-surface-400">
  Redirecting...
</div>