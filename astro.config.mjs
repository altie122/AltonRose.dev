// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";

import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  site: "https://altonrose.dev",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), sitemap(), mdx(), db()],
  adapter: vercel(),
  output: "server",
});