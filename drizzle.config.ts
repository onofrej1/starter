import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema/index.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: [`shadcn_*`],
} satisfies Config;
