import asyncHandler from "../utils/asyncHandler.js";
import Folder from "../models/folder.model.js";
import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js";

const getFolders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const folders = await Folder.find({
    creator: userId,
  });

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

  console.log("Deleting folder, logged-in userId:", userId);
  console.log("Folder ID to delete:", folderId);

  // Fetch the folder from the database
  const folder = await Folder.findById(folderId);
  console.log("folder", folder);
  if (!folder) {
    console.log("Folder not found.");
    throw new ApiError(404, "folder not found");
  }

  console.log("Folder creator ID:", folder.creator.toString());

  // If the logged-in user is the creator of the folder, allow deletion
  if (folder.creator.equals(userId)) {
    console.log("User is the creator of the folder, proceeding to delete.");
    await folder.deleteOne();
    return res.status(200).json({
      message: "folder deleted successfully",
    });
  }

  console.log(
    "User is not the creator. Checking shared workspace permissions."
  );

  // If the user is not the creator, check if they have "edit" permissions in the shared workspace
  const user = await User.findById(userId);
  console.log("User's shared dashboards:", user.sharedDashboards);

  const sharedWorkspace = user.sharedDashboards.find((shared) =>
    shared.dashboardId.equals(folder.creator)
  );

  if (!sharedWorkspace) {
    console.log("No shared workspace found for this folder.");
    throw new ApiError(
      403,
      "You do not have permission to delete a folder in this workspace"
    );
  }

  console.log("Found shared workspace:", sharedWorkspace);

  // Check if the user has "edit" permissions
  if (!sharedWorkspace.permissions.includes("edit")) {
    console.log("User does not have edit permissions in the shared workspace.");
    throw new ApiError(
      403,
      "You do not have permission to delete a folder in this workspace"
    );
  }

  console.log("User has 'edit' permissions, proceeding to delete folder.");
  await folder.deleteOne();
  res.status(200).json({
    message: "folder deleted successfully",
  });
});

export { createFolder, getFolders, deleteFolder };
