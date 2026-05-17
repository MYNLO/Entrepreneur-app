import { writable } from 'svelte/store';
import { pb } from '$lib/pb/client';
import type { AuthModel } from 'pocketbase';

export const authUser = writable<AuthModel | null>(pb.authStore.model as AuthModel | null);
export const isSubActive = writable<boolean>(false);

// Sync store whenever auth changes
pb.authStore.onChange((token, model) => {
  authUser.set(model as AuthModel | null);
  isSubActive.set(model?.subscription_status === 'active' || model?.role === 'admin');
});