import PocketBase from 'pocketbase';
import { browser } from '$app/environment';

export const pb = new PocketBase(import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090');

if (browser) {
  pb.authStore.loadFromCookie(document.cookie);
  pb.authStore.onChange(() => {
    document.cookie = pb.authStore.exportToCookie({
      httpOnly: false,
      secure: location.protocol === 'https:',
      sameSite: 'Lax',
      path: '/'
    });
  });
}
