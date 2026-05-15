import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

const PB_URL = import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.pb = new PocketBase(PB_URL);

  const cookie = event.request.headers.get('cookie') ?? '';
  event.locals.pb.authStore.loadFromCookie(cookie);

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('<html', '<html class="dark"')
  });

  if (event.locals.pb.authStore.isValid) {
    response.headers.append(
      'set-cookie',
      event.locals.pb.authStore.exportToCookie({
        httpOnly: true,
        secure: event.url.protocol === 'https:',
        sameSite: 'strict',
        path: '/'
      })
    );
  }

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' http://127.0.0.1:* ws: wss: https:; font-src 'self';"
  );

  return response;
};
