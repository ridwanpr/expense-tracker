import z from "zod";

export class UserValidation {
  static readonly REGISTER = z.object({
    username: z
      .string({ message: "Username is required" })
      .min(3, { message: "Username must be at least 3 characters" })
      .max(100, { message: "Username must be less than 100 characters" }),
    password: z
      .string({ message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .max(100, { message: "Password must be less than 100 characters" }),
    name: z
      .string({ message: "Name is required" })
      .min(3, { message: "Name must be at least 3 characters" })
      .max(100, { message: "Name must be less than 100 characters" }),
  });
}
