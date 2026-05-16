import { join } from 'path';
import { skeleton, contentPath } from '@skeletonlabs/skeleton/tailwind';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    contentPath(import.meta.url, 'svelte')
  ],
  theme: { extend: {} },
  plugins: [
    skeleton({
      themes: [{ name: 'catppuccin' }]
    })
  ]
};