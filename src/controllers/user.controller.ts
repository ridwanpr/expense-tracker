import { Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { UserRequest } from "../types/request-type";
import { CreateUserRequest } from "../models/user.model";

export class UserController {
  static async register(
    req: UserRequest<CreateUserRequest>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const serviceResponse = await UserService.register(req.body);
      const { refreshToken, ...userData } = serviceResponse;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(200).json({
        success: true,
        message: "Register user success",
        data: {
          name: userData.name,
          username: userData.username,
        },
        accessToken: userData.accessToken,
      });
    } catch (err) {
      next(err);
    }
  }
}
