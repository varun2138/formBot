import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js";
import Folder from "../models/folder.model.js";
import Form from "../models/form.model.js";
import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }
  const user = await User.create({
    username,
    email,
    password,
  });
  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    console.log("error in user register controller");
    throw new ApiError(500, (message = "server error "));
  }
  return res.status(201).json({
    user: createdUser,
    message: "user registered successfully",
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "incorrect password");
  }

  const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN, {
    expiresIn: process.env.SECRET_TOKEN_EXPIRY,
  });
  const loggedInUser = await User.findById(user._id).select("-password");
  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    })
    .json({
      user: loggedInUser,
      message: "User logged In successfully",
    });
});

const logout = asyncHandler(async (req, res) => {
  console.log("logout hit api");
  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    })
    .status(200)
    .json({ status: true, message: "user logged out successfully" });
});

const updateUser = asyncHandler(async (req, res) => {
  const { email, username, password, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (username && username !== user.username) {
    user.username = username;
  }

  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== user._id.toString()) {
      throw new ApiError(400, "This email already exists");
    }
    user.email = email;
  }

  if (newPassword) {
    if (!password) {
      throw new ApiError(400, "current password  is required");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Incorrect current password");
    }

    if (newPassword === password) {
      throw new ApiError(400, "New password cannot be same as the current one");
    }
    user.password = newPassword;
  }
  await user.save();
  const updatedUser = await User.findById(user._id).select("-password");

  return res.status(200).json({
    user: updatedUser,
    message: "User updated successfully",
  });
});

// Share Workspace with Another User
const shareDashboard = asyncHandler(async (req, res) => {
  const { recipientEmail, permissions } = req.body;

  if (!permissions) {
    throw new ApiError(400, "permissions are required");
  }

  const currentUser = await User.findById(req.user._id);
  if (!currentUser) {
    throw new ApiError(404, "Current user not found");
  }

  if (recipientEmail) {
    if (currentUser.email === recipientEmail) {
      throw new ApiError(400, "You cannot share the dashboard with yourself");
    }

    // Find the recipient user
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      throw new ApiError(404, "Recipient user not found");
    }

    // Checking if the workspace already exists in the recipient's sharedWorkspaces
    const isAlreadyShared = recipient.sharedDashboards.some(
      (shared) => shared.dashboardId.toString() === currentUser._id.toString()
    );
    if (isAlreadyShared) {
      throw new ApiError(400, "dashboard is already shared with this user");
    }

    const sharedFolders = await Folder.find({
      creator: currentUser._id,
    }).populate("forms");
    const standaloneForms = await Form.find({
      creator: currentUser._id,
      parentFolder: null,
    });

    recipient.sharedDashboards.push({
      dashboardId: currentUser._id,
      permissions,
    });
    await recipient.save();

    return res.status(200).json({
      message: "Dashboard shared successfully",
      sharedData: {
        sharedUsers: [
          {
            id: currentUser._id,
            name: currentUser.username,
            permissions: permissions,
            folders: sharedFolders,
            forms: standaloneForms,
          },
        ],
      },
    });
  } else {
    const token = jwt.sign(
      {
        userId: currentUser._id,
        permissions,
      },
      process.env.SECRET_TOKEN,
      {
        expiresIn: process.env.SECRET_TOKEN_EXPIRY,
      }
    );
    //link to share with other users
    const sharableLink = `${process.env.CLIENT_URL}/dashboard/?token=${token}`;
    res.status(200).json({
      message: "Workspace shared successfully with a link",
      sharableLink,
    });
  }
});

const acceptSharedDashboard = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new ApiError(400, "Token is required");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const { userId, permissions } = decoded;

    const recipient = await User.findById(req.user._id);
    if (!recipient) {
      throw new ApiError(404, "Recipient user not found");
    }

    const isAlreadyShared = recipient.sharedDashboards.some(
      (shared) => shared.dashboardId.toString() === userId.toString()
    );
    if (isAlreadyShared) {
      throw new ApiError(400, "dashboard is already shared with this user");
    }
    const sharer = await User.findById(userId).select("username");

    const sharedFolders = await Folder.find({ creator: userId }).populate(
      "forms"
    );
    const sharedForms = await Form.find({
      creator: userId,
      parentFolder: null,
    });

    recipient.sharedDashboards.push({
      dashboardId: userId,
      permissions,
    });

    await recipient.save();

    res.status(200).json({
      message: "dashboard successfully added to your account",
      sharedData: {
        sharedUsers: [
          {
            id: sharer._id,
            name: sharer.username,
            permissions: permissions,
            folders: sharedFolders,
            forms: sharedForms,
          },
        ],
      },
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(400, "Invalid or expired token");
  }
});

// Get User's Shared Workspaces
const getSharedDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate({
      path: "sharedDashboards.dashboardId",
      select: "username",
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const sharedUsers = await Promise.all(
      user.sharedDashboards.map(async (dashboard) => {
        const sharedFolders = await Folder.find({
          creator: dashboard.dashboardId._id,
        }).populate("forms");
        const sharedForms = await Form.find({
          creator: dashboard.dashboardId._id,
          parentFolder: null,
        });

        return {
          id: dashboard.dashboardId._id,
          name: dashboard.dashboardId.username,
          permissions: dashboard.permissions,
          folders: sharedFolders,
          forms: sharedForms,
        };
      })
    );
    const sharedData = {
      sharedUsers,
    };
    res.status(200).json({ sharedData });
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error fetching shared dashboard");
  }
});

export {
  register,
  login,
  logout,
  updateUser,
  shareDashboard,
  acceptSharedDashboard,
  getSharedDashboard,
};
