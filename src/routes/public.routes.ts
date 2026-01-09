import express from "express";
import { UserController } from "../controllers/user.controller.js";

export const publicRouter = express.Router();
publicRouter.post("/api/register", UserController.register);
publicRouter.post("/api/login", UserController.login);
