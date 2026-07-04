// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: import.meta.env.SITE_URL || 'http://localhost:3000',
  vite: {
    plugins: [tailwindcss()]
  }
});