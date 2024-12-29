import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());

// routes import
import userRouter from "./routes/user.route.js";
import formRouter from "./routes/form.route.js";
import folderRouter from "./routes/folder.route.js";
import responseRouter from "./routes/response.route.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/folders", folderRouter);
app.use("/api/v1/forms", formRouter);
app.use("/api/v1/responses", responseRouter);

export default app;
