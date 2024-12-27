import asyncHandler from "../utils/asyncHandler.js";
import Folder from "../models/folder.model.js";
import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js";

const getFolders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const folders = await Folder.find({
    creator: userId,
  }).populate("forms");

  if (!folders) {
    throw new ApiError(404, "no folders found");
  }
  res.status(200).json({
    message: "folders fetched successfully",
    folders,
  });
});

const createFolder = asyncHandler(async (req, res) => {
  const { folderName, dashboardId } = req.body;
  const userId = req.user._id;

  if (!dashboardId) {
    const folder = await Folder.create({
      folderName,
      creator: userId,
    });
    if (!folder) {
      throw new ApiError(500, "Error creating folder");
    }
    return res.status(201).json({
      folder,
      message: "folder created sucessfully",
    });
  }

  const user = await User.findById(userId);
  console.log(user);
  const sharedWorkspace = user.sharedDashboards.find(
    (shared) => shared.dashboardId.toString() === dashboardId.toString()
  );

  console.log(sharedWorkspace);
  if (!sharedWorkspace || !sharedWorkspace.permissions.includes("edit")) {
    throw new ApiError(
      403,
      "You do not have permission to create a folder in this workspace"
    );
  }

  const sharedUser = await User.findById(sharedWorkspace.dashboardId);

  const folder = await Folder.create({
    folderName,
    creator: sharedUser._id,
  });

  if (!folder) {
    throw new ApiError(500, "Error creating folder");
  }

  res.status(201).json({
    folder,
    message: "Folder created successfully",
  });
});

const deleteFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const userId = req.user._id;

  const folder = await Folder.findById(folderId);

  if (!folder) {
    throw new ApiError(404, "folder not found");
  }

  if (folder.creator.equals(userId)) {
    await folder.deleteOne();
    return res.status(200).json({
      message: "folder deleted successfully",
    });
  }

  const user = await User.findById(userId);

  const sharedWorkspace = user.sharedDashboards.find((shared) =>
    shared.dashboardId.equals(folder.creator)
  );

  if (!sharedWorkspace) {
    throw new ApiError(
      403,
      "You do not have permission to delete a folder in this workspace"
    );
  }

  if (!sharedWorkspace.permissions.includes("edit")) {
    throw new ApiError(
      403,
      "You don't have permission to delete a folder in this workspace"
    );
  }

  await folder.deleteOne();
  res.status(200).json({
    message: "folder deleted successfully",
  });
});

const getFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  console.log(folderId);
  const folder = await Folder.findById(folderId).populate("forms");
  if (!folder) {
    throw new ApiError(404, "Folder not found");
  }
  return res.status(200).json({
    message: "Folder retrieved successfully",
    folder,
  });
});
export { createFolder, getFolders, deleteFolder, getFolder };
