// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://altonrose.dev",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), sitemap(), mdx()],
  adapter: vercel(),
  output: "server",
});
