import { User } from "../generated/prisma/client";

export type UserResponse = {
  username: string;
  name: string;
  refreshToken: string;
  accessToken: string;
};

export type CreateUserRequest = {
  username: string;
  name: string;
  password: string;
};

export function toUserResponse(
  user: User,
  refreshToken: string,
  accessToken: string
): UserResponse {
  return {
    name: user.name,
    username: user.username,
    refreshToken: refreshToken,
    accessToken: accessToken,
  };
}
