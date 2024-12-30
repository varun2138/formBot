import Router from "express";
import {
  getResponsesById,
  partialResponses,
  submitForm,
} from "../controllers/response.controller.js";
const responseRouter = Router();
responseRouter.route("/forms/form/:formId").post(submitForm);
responseRouter.route("/form/:formId").get(getResponsesById);
responseRouter.route("/form/:formId").post(partialResponses);
export default responseRouter;
