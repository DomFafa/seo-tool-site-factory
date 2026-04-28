import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const siteId = process.env.SITE_ID;

if (!siteId) {
  console.warn('[site-factory] SITE_ID is not set. Use `pnpm site dev <site-id>` or `pnpm site build <site-id>`.');
}

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  outDir: siteId ? `../../dist/sites/${siteId}` : '../../dist/site-unknown',
  vite: {
    define: {
      __SITE_ID__: JSON.stringify(siteId ?? '')
    },
    ssr: {
      noExternal: ['@astrojs/react']
    }
  }
});
