import { execSync } from "child_process";

export default async function () {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl || !dbUrl.includes("_test")) {
    throw new Error(
      `Test aborted: DATABASE_URL must contain '_test'. Current: ${dbUrl}`
    );
  }

  execSync("prisma migrate reset --force", { stdio: "inherit" });
}
