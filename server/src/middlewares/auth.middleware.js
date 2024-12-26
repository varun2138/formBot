import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js";

export const authProtect = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "UnAuthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);

    const user = await User.findById(decodedToken._id).select("-password");

    if (!user) {
      throw new ApiError(401, "user not found ! Invalid token");
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token Expired, please log in again");
    } else if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token Authentication failed");
    } else {
      throw new ApiError(401, error?.message || "Authorization error");
    }
  }
});
