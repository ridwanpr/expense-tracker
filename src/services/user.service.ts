import bcrypt from "bcrypt";
import { prisma } from "../application/database";
import { ResponseError } from "../error/response.error";
import { CreateUserRequest, toUserResponse } from "../models/user.model";
import { UserValidation } from "../validations/user.validation";
import { Validation } from "../validations/validation";
import { generateToken } from "../utils/generateToken";

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
}
