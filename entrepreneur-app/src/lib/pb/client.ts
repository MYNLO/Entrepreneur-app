import PocketBase from 'pocketbase';
import { browser } from '$app/environment';

const pbUrl = import.meta.env.VITE_PB_URL || 'http://92.242.61.170:8090';

export const pb = new PocketBase(pbUrl);

if (browser) {
  pb.authStore.loadFromCookie(document.cookie);
  pb.authStore.onChange(() => {
    document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
  });
}

console.log('PocketBase initialized with URL:', pbUrl);