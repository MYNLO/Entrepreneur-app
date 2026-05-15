import { writable } from 'svelte/store';
import { pb } from '$lib/pb/client';
import type { RecordModel } from 'pocketbase';

export const authUser = writable<RecordModel | null>(pb.authStore.model);
export const isSubActive = writable<boolean>(false);

// Sync store whenever auth changes
pb.authStore.onChange((token, model) => {
  authUser.set(model);
  isSubActive.set(model?.subscription_status === 'active' || model?.role === 'admin');
});