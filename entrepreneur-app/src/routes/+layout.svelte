<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pb/client';
	import { setupOfflineSync } from '$lib/stores/queue';
	import { authUser } from '$lib/stores/auth';

	onMount(() => {
		// Common auth setup so the rest of your app continues to work like before
		if (pb.authStore.isValid) {
			authUser.set(pb.authStore.model);
		}

		pb.authStore.onChange((token, model) => {
			authUser.set(model);
		});

		// Setup offline sync when the app loads
		setupOfflineSync(pb);
	});
</script>

<slot />