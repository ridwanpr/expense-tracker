import express from "express";
import { errorMiddleware } from "../middleware/error.middleware.js";
import { publicRouter } from "../routes/public.routes.js";
import { trimMiddleware } from "../middleware/trim.middleware.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(trimMiddleware);

app.use(publicRouter);

app.use((_req, res, _next) => {
  res.status(404).json({
    errors: "URI Not Found",
  });
});

app.use(errorMiddleware);

export default app;
