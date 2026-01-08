import supertest from "supertest";
import app from "../src/application/app";
import { prisma } from "../src/application/database";
import { describe, it, expect, afterEach, afterAll } from "vitest";
import { UserTest } from "./test-util";

describe("POST /api/register", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should reject register user if request invalid", async () => {
    const response = await supertest(app)
      .post("/api/register")
      .send({ username: "", password: "", name: "" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should register new user", async () => {
    const response = await supertest(app)
      .post("/api/register")
      .send({ username: "test", password: "test123", name: "test" });

    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("test");
  });
});
