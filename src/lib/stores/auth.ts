import { writable } from 'svelte/store';
import { pb } from '$lib/pb/client';
import type { User } from '$lib/types/pb';

export const authUser = writable<User | null>(pb.authStore.model as User | null);
export const isSubActive = writable(false);

pb.authStore.onChange((_token, model) => {
  authUser.set(model as User | null);
  const user = model as User | null;
  isSubActive.set(user?.subscription_status === 'active' || user?.role === 'admin');
});
