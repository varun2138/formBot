import User from "../models/user.model.js";
import Form from "../models/form.model.js";
import Folder from "../models/folder.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

const createForm = asyncHandler(async (req, res) => {
  const { formName, parentFolder, dashboardId } = req.body;
  const userId = req.user._id;

  let creatorId = userId;

  if (dashboardId) {
    const user = await User.findById(userId);
    const sharedWorkspace = user.sharedDashboards.find(
      (shared) => shared.dashboardId.toString() === dashboardId.toString()
    );

    if (!sharedWorkspace) {
      throw new ApiError(
        403,
        "You do not have access to this shared workspace"
      );
    }

    if (!sharedWorkspace.permissions.includes("edit")) {
      throw new ApiError(
        403,
        "you do not have permission to create a form in this workspace"
      );
    }
    creatorId = dashboardId;
  }

  if (parentFolder) {
    const folder = await Folder.findById(parentFolder);
    if (!folder) {
      throw new ApiError(404, "Folder not found");
    }

    if (!folder.creator.equals(creatorId)) {
      throw new ApiError(403, "you cannot add a form to this folder");
    }
  }

  const form = await Form.create({
    formName,
    creator: creatorId,
    fields: [],
    parentFolder,
    isStandalone: !parentFolder,
    dashboardId,
  });
  const formLink = `${process.env.CLIENT_URL}/forms/${form._id}`;
  form.formLink = formLink;
  await form.save();

  if (parentFolder) {
    await Folder.findByIdAndUpdate(parentFolder, {
      $push: { forms: form._id },
    });
  }

  res.status(201).json({
    message: "Form created successfully",
    form,
  });
});

const addFields = asyncHandler(async (req, res) => {
  const { formId } = req.params;
  const { fields } = req.body;
  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    throw new ApiError(400, "Form must have at least one field");
  }
  const lastField = fields[fields.length - 1];
  if (lastField.type !== "input" || lastField.inputType !== "button") {
    return res.status(400).json({
      message: "Submit button must be at the end of the form",
    });
  }
  const isButtonInMiddle = fields.some(
    (field, index) =>
      field.type === "input" &&
      field.inputType === "button" &&
      index !== fields.length - 1
  );

  if (isButtonInMiddle) {
    throw new ApiError(400, "Submit button must be at the end");
  }

  const form = await Form.findById(formId);
  if (!form) {
    throw new ApiError(404, "Form not found");
  }
  const hasExistingButton = form.fields.some(
    (field) => field.type === "input" && field.inputType === "button"
  );
  if (hasExistingButton) {
    throw new ApiError(400, "Submit button already exists in the form");
  }

  form.fields = [...form.fields, ...fields];

  const formLink = form.formLink;
  await form.save();
  res.status(200).json({
    message: "Fields added successfully",
    form,
    formLink,
  });
});
const getForms = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const forms = await Form.find({
    creator: userId,
    isStandalone: true,
  });

  if (!forms) {
    throw new ApiError(404, "no forms found");
  }
  res.status(200).json({
    message: "forms retrieved successfully",
    forms,
  });
});

const getForm = asyncHandler(async (req, res) => {
  const { formId } = req.params;

  console.log("get form called");
  console.log(formId);
  const form = await Form.findById(formId);
  if (!form) {
    throw new ApiError(404, "No form found");
  }
  res.status(200).json({
    message: "form retrieved successfully",
    form,
  });
});

const deleteForm = asyncHandler(async (req, res) => {
  const { formId } = req.params;
  const userId = req.user._id;
  const form = await Form.findById(formId);
  if (!form) {
    throw new ApiError(404, "Form not found");
  }

  if (form.creator.equals(userId)) {
    if (form.parentFolder) {
      await Folder.findByIdAndUpdate(form.parentFolder, {
        $pull: { forms: formId },
      });
    }
    await form.deleteOne();
    return res.status(200).json({
      message: "Form deleted successfully",
    });
  }

  const user = await User.findById(userId);

  const sharedWorkspace = user.sharedDashboards.find((shared) =>
    shared.dashboardId.equals(form.creator)
  );
  if (!sharedWorkspace) {
    throw new ApiError(
      403,
      " You do not have permission to delete a form in this workspace"
    );
  }

  if (!sharedWorkspace.permissions.includes("edit")) {
    throw new ApiError(
      403,
      "You don't have permission to delete a form in this workspace"
    );
  }

  if (form.parentFolder) {
    await Folder.findByIdAndUpdate(form.parentFolder, {
      $pull: { forms: formId },
    });
  }

  await form.deleteOne();
  res.status(200).json({
    message: "Form deleted successfully",
  });
});
export { createForm, addFields, getForms, getForm, deleteForm };
