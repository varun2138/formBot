import Router from "express";
import { authProtect } from "../middlewares/auth.middleware.js";
import {
  addFields,
  createForm,
  deleteForm,
  getForm,
  getForms,
} from "../controllers/form.controller.js";

const formRouter = Router();

formRouter.route("/create").post(authProtect, createForm);
formRouter.route("/form/:formId/fields").put(authProtect, addFields);
formRouter.route("/").get(authProtect, getForms);
formRouter.route("/:formId").get(getForm);
formRouter.route("/protected/:formId").get(authProtect, getForm);
formRouter.route("/:formId").delete(authProtect, deleteForm);

export default formRouter;
