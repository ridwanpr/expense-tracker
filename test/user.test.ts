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

  it("should reject register user if there's no request body", async () => {
    const response = await supertest(app).post("/api/register").send();

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

  it("should reject register if username already exists", async () => {
    await supertest(app)
      .post("/api/register")
      .send({ username: "test", password: "test123", name: "test" });

    const response = await supertest(app)
      .post("/api/register")
      .send({ username: "test", password: "different", name: "test2" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should reject register with invalid password format", async () => {
    const response = await supertest(app)
      .post("/api/register")
      .send({ username: "test", password: "123", name: "test" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should not return password in response", async () => {
    const response = await supertest(app)
      .post("/api/register")
      .send({ username: "test", password: "test123", name: "test" });

    expect(response.status).toBe(200);
    expect(response.body.data.password).toBeUndefined();
  });

  it("should reject register with invalid username format", async () => {
    const response = await supertest(app)
      .post("/api/register")
      .send({ username: "ab", password: "test123", name: "test" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should trim whitespace from inputs", async () => {
    const response = await supertest(app)
      .post("/api/register")
      .send({ username: "  test  ", password: "test123", name: "  test  " });

    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("test");
  });
});

describe("POST /api/login", () => {
  afterEach(async () => {
    await UserTest.delete();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should reject login if no request body", async () => {
    await UserTest.create();

    const response = await supertest(app).post("/api/login").send();

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should reject login if user not found", async () => {
    const response = await supertest(app)
      .post("/api/login")
      .send({ username: "test", password: "test" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should reject login if credentials invalid", async () => {
    await UserTest.create();

    const response = await supertest(app)
      .post("/api/login")
      .send({ username: "test", password: "tests" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should login if credentials is valid", async () => {
    await UserTest.create();

    const response = await supertest(app)
      .post("/api/login")
      .send({ username: "test", password: "123456" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Login user success");
  });

  it("should trim whitespace from inputs", async () => {
    await UserTest.create();

    const response = await supertest(app)
      .post("/api/login")
      .send({ username: "  test ", password: "123456" });

    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.name).toBe("test");
  });
});
