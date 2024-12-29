import Router from "express";
import {
  getResponsesById,
  submitForm,
} from "../controllers/response.controller.js";
const responseRouter = Router();
responseRouter.route("/forms/form/:formId").post(submitForm);
responseRouter.route("/form/:formId").get(getResponsesById);
export default responseRouter;
