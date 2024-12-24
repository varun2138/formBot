import Router from "express";
import {
  login,
  logout,
  register,
  updateUser,
  shareDashboard,
  getSharedDashboard,
  acceptSharedDashboard,
} from "../controllers/user.controller.js";
import { authProtect } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/logout").post(authProtect, logout);
userRouter.route("/update").put(authProtect, updateUser);
userRouter.route("/share-dashboard").post(authProtect, shareDashboard);
userRouter.route("/shared-dashboards").get(authProtect, getSharedDashboard);
userRouter.route("/accept-dashboard").get(authProtect, acceptSharedDashboard);
export default userRouter;
