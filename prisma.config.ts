import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const url = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL ?? "file:./dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    adapter: new PrismaLibSql({ url, authToken }),
  },
});
