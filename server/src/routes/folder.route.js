import {
  createFolder,
  deleteFolder,
  getFolder,
  getFolders,
} from "../controllers/folder.controller.js";
import { authProtect } from "../middlewares/auth.middleware.js";

import Router from "express";
const folderRouter = Router();

folderRouter.route("/create").post(authProtect, createFolder);
folderRouter.route("/").get(authProtect, getFolders);
folderRouter.route("/:folderId").delete(authProtect, deleteFolder);
folderRouter.route("/:folderId").get(authProtect, getFolder);

export default folderRouter;
