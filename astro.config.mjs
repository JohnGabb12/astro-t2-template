// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const FRAMEWORK_LOADERS = {
  // @ts-expect-error - Might not be installed yet
  react: () => import('@astrojs/react'),
  // @ts-expect-error - Might not be installed yet
  vue: () => import('@astrojs/vue'),
  // @ts-expect-error - Might not be installed yet
  solid: () => import('@astrojs/solid-js'),
  // @ts-expect-error - Might not be installed yet
  svelte: () => import('@astrojs/svelte'),
  // @ts-expect-error - Might not be installed yet
  angular: () => import('@astrojs/angular'),
};

async function loadActiveIntegrations() {
  const active = [];

  for (const [_, load] of Object.entries(FRAMEWORK_LOADERS)) {
    try {
      const module = await load();
      active.push(module.default());
    } catch {
      // skip
    }
  }

  return active;
}

const autoIntegrations = await loadActiveIntegrations();

export default defineConfig({
  integrations: [...autoIntegrations],
  site: import.meta.env.SITE_URL || 'http://localhost:4321',
  vite: {
    plugins: [tailwindcss()]
  }
});