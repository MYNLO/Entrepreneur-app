import PocketBase from 'pocketbase';
import { browser } from '$app/environment';

const pbUrl = import.meta.env.VITE_PB_URL;

if (!pbUrl) {
  console.error('❌ VITE_PB_URL is not set! Please set it in your .env or in Coolify.');
}

export const pb = new PocketBase(pbUrl || 'http://127.0.0.1:8090');

if (browser) {
  pb.authStore.loadFromCookie(document.cookie);
  pb.authStore.onChange(() => {
    document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
  });
}

console.log('PocketBase connected to:', pbUrl || 'http://127.0.0.1:8090');