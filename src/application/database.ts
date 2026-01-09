import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, Prisma } from "../generated/prisma/client.js";
import logger from "./logging.js";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST!,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  connectionLimit: 10,
});

const prisma = new PrismaClient({
  adapter,
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

prisma.$on("error", (e: Prisma.LogEvent) => {
  logger.error(e);
});

prisma.$on("warn", (e: Prisma.LogEvent) => {
  logger.warn(e);
});

prisma.$on("info", (e: Prisma.LogEvent) => {
  logger.info(e);
});

// prisma.$on('query', (e) => {
//   logger.info(e);
// });

export { prisma };
