import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { jwtVerify } from "jose";
import { generateToken } from "../src/utils/generateToken";
import { JWT_SECRET } from "../src/utils/getJwtSecret";

describe("generateToken", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should generate a valid JWT token", async () => {
    const token = await generateToken({ userId: "123" });

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
  });

  it("should generate token with default 15m expiration", async () => {
    const token = await generateToken({ userId: "123" });
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const now = Math.floor(Date.now() / 1000);
    const expectedExp = now + 15 * 60; // 15 minutes

    expect(payload.exp).toBeDefined();
    expect(payload.exp).toBe(expectedExp);
  });

  it("should generate token with custom expiration time", async () => {
    const token = await generateToken({ userId: "123" }, "1h");
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const now = Math.floor(Date.now() / 1000);
    const expectedExp = now + 60 * 60; // 1 hour

    expect(payload.exp).toBe(expectedExp);
  });

  it("should include payload data in the token", async () => {
    const testPayload = {
      userId: "123",
      email: "test@example.com",
      role: "admin",
    };

    const token = await generateToken(testPayload);
    const { payload } = await jwtVerify(token, JWT_SECRET);

    expect(payload.userId).toBe("123");
    expect(payload.email).toBe("test@example.com");
    expect(payload.role).toBe("admin");
  });

  it("should handle empty payload", async () => {
    const token = await generateToken({});
    const { payload } = await jwtVerify(token, JWT_SECRET);

    expect(payload).toBeDefined();
    expect(payload.exp).toBeDefined();
    expect(payload.iat).toBeDefined();
  });

  it("should set issuedAt timestamp", async () => {
    const token = await generateToken({ userId: "123" });
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const now = Math.floor(Date.now() / 1000);
    expect(payload.iat).toBe(now);
  });

  it("should use HS256 algorithm", async () => {
    const token = await generateToken({ userId: "123" });
    const { protectedHeader } = await jwtVerify(token, JWT_SECRET);

    expect(protectedHeader.alg).toBe("HS256");
  });

  it("should handle various expiration formats", async () => {
    const expirations = ["30s", "5m", "2h", "7d"];

    for (const exp of expirations) {
      const token = await generateToken({ userId: "123" }, exp);
      const { payload } = await jwtVerify(token, JWT_SECRET);

      expect(payload.exp).toBeDefined();
      expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    }
  });

  it("should handle short expiration times", async () => {
    const token = await generateToken({ userId: "123" }, "1s");
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const now = Math.floor(Date.now() / 1000);
    expect(payload.exp).toBe(now + 1);
  });

  it("should handle long expiration times", async () => {
    const token = await generateToken({ userId: "123" }, "30d");
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const now = Math.floor(Date.now() / 1000);
    const expectedExp = now + 30 * 24 * 60 * 60;

    expect(payload.exp).toBe(expectedExp);
  });

  it("should handle payload with standard JWT claims", async () => {
    const testPayload = {
      sub: "user123",
      aud: "api.example.com",
      iss: "auth.example.com",
    };

    const token = await generateToken(testPayload);
    const { payload } = await jwtVerify(token, JWT_SECRET);

    expect(payload.sub).toBe("user123");
    expect(payload.aud).toBe("api.example.com");
    expect(payload.iss).toBe("auth.example.com");
  });

  it("should generate different tokens for same payload", async () => {
    const payload = { userId: "123" };
    const token1 = await generateToken(payload);
    vi.advanceTimersByTime(1000);
    const token2 = await generateToken(payload);

    expect(token1).not.toBe(token2);
  });

  it("should handle large payloads", async () => {
    const largePayload = {
      userId: "123",
      data: "x".repeat(1000),
      permissions: Array(50).fill("read:resource"),
    };

    const token = await generateToken(largePayload);
    const { payload } = await jwtVerify(token, JWT_SECRET);

    expect(payload.userId).toBe("123");
    expect(payload.data).toBe("x".repeat(1000));
    expect(payload.permissions).toHaveLength(50);
  });
});

describe("JWT_SECRET", () => {
  it("should be a Uint8Array", () => {
    expect(JWT_SECRET).toBeInstanceOf(Uint8Array);
  });

  it("should have encoded the secret correctly", () => {
    const secretString = process.env.JWT_SECRET!;
    const expectedEncoded = new TextEncoder().encode(secretString);

    expect(JWT_SECRET).toEqual(expectedEncoded);
  });

  it("should not be empty", () => {
    expect(JWT_SECRET.length).toBeGreaterThan(0);
  });
});
