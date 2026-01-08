import express from "express";
import { errorMiddleware } from "../middleware/error.middleware";
import { publicRouter } from "../routes/public.routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(publicRouter);

app.use((_req, res, _next) => {
  res.status(404).json({
    errors: "URI Not Found",
  });
});

app.use(errorMiddleware);

export default app;
