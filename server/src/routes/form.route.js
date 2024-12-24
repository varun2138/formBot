import Router from "express";
import { authProtect } from "../middlewares/auth.middleware.js";
import {
  createForm,
  deleteForm,
  getForms,
  updateForm,
} from "../controllers/form.controller.js";

const formRouter = Router();

formRouter.route("/").post(authProtect, createForm);
formRouter.route("/").get(authProtect, getForms);
formRouter.route("/:id").put(authProtect, updateForm);
formRouter.route("/").delete(authProtect, deleteForm);

export default formRouter;
