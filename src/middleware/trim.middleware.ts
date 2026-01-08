import { Request, Response, NextFunction } from "express";

export const trimMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};
