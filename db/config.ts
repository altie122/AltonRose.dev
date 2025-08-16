import { column, defineDb, defineTable, NOW, sql } from "astro:db";

const GithubStatsCache = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    stars: column.number(),
    createdAt: column.number({
      default: sql`(strftime('%s', 'now'))`,
    }),
    currentCycleStartedAt: column.number({
      default: sql`(strftime('%s', 'now'))`,
    }),
    cacheExpiresAt: column.number({
      default: sql`(strftime('%s', 'now', '+7 days'))`,
    }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    GithubStatsCache
  },
});
