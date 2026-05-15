<script lang="ts">
  import { goto } from '$app/navigation';
  import { authUser, isSubActive } from '$lib/stores/auth';
  import { onMount } from 'svelte';

  onMount(() => {
    if (!$authUser) {
      goto('/login');
    } else if ($isSubActive) {
      goto('/channels');
    }
  });
</script>

<div class="min-h-screen flex items-center justify-center bg-base-100 text-base-400">
  Redirecting...
</div>
