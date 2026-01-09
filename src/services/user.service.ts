import bcrypt from "bcrypt";
import { prisma } from "../application/database.js";
import { ResponseError } from "../error/response.error.js";
import {
  CreateUserRequest,
  LoginRequest,
  toUserResponse,
} from "../models/user.model.js";
import { UserValidation } from "../validations/user.validation.js";
import { Validation } from "../validations/validation.js";
import { generateToken } from "../utils/generateToken.js";

export class UserService {
  static async register(request: CreateUserRequest) {
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request
    );

    const isUsernameUsed = await prisma.user.findFirst({
      where: {
        username: registerRequest.username,
      },
    });

    if (isUsernameUsed) {
      throw new ResponseError(400, "Username already exists");
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 11);

    const newUser = await prisma.user.create({
      data: registerRequest,
    });

    const payload = { userId: newUser.id };
    const accessToken = await generateToken(payload, "15m");
    const refreshToken = await generateToken(payload, "30d");

    return toUserResponse(newUser, refreshToken, accessToken);
  }

  static async login(request: LoginRequest) {
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);

    const user = await prisma.user.findFirst({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new ResponseError(400, "Invalid Credentials");
    }

    const passwordIsmatch = await bcrypt.compare(
      loginRequest.password,
      user.password
    );

    if (!passwordIsmatch) {
      throw new ResponseError(400, "Invalid Credentials");
    }

    const payload = { userId: user.id };
    const accessToken = await generateToken(payload, "15m");
    const refreshToken = await generateToken(payload, "30d");

    return toUserResponse(user, refreshToken, accessToken);
  }
}
