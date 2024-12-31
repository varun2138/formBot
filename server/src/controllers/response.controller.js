import Form from "../models/form.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import Response from "../models/responses.model.js";
import mongoose from "mongoose";

const submitForm = asyncHandler(async (req, res) => {
  const { formId } = req.params;
  const { responses } = req.body;
  const form = await Form.findById(formId);

  if (!form) {
    throw new ApiError(404, "Form not found");
  }

  const formattedResponses = Object.keys(responses).map((fieldId) => ({
    fieldId: mongoose.Types.ObjectId.isValid(fieldId) ? fieldId : null,
    value: responses[fieldId],
  }));

  formattedResponses.push({
    fieldId: new mongoose.Types.ObjectId(),
    value: "form submit",
  });

  const newResponse = await Response.create({
    formId,
    responses: formattedResponses.filter((res) => res.fieldId),
    submittedAt: new Date(),
  });

  console.log(newResponse);
  form.submitCount += 1;
  await form.save();
  res.status(200).json({
    message: "Form submitted successfully ",
    response: newResponse,
    submitCount: form.submitCount,
  });
});

const partialResponses = asyncHandler(async (req, res) => {
  const { formId, fieldId, value, responseId } = req.body;

  if (!responseId || !formId || !fieldId || value === undefined) {
    throw new ApiError(400, "Error missing fields");
  }

  const existingResponse = await Response.findOne({ responseId, formId });

  if (!existingResponse) {
    throw new ApiError(404, "response not found");
  }
  if (existingResponse) {
    if (!existingResponse.responses) {
      existingResponse.responses = [];
    }

    const newResponseField = {
      fieldId,
      value,
    };
    existingResponse.responses.push(newResponseField);

    await existingResponse.save();
    return res
      .status(200)
      .json({ message: "Partial response updated", data: existingResponse });
  } else {
    const newResponse = new Response({
      responseId,
      formId,
      responses: [
        {
          fieldId,
          value,
        },
      ],
    });

    await newResponse.save();
    return res
      .status(201)
      .json({ message: "Partial response saved", data: newResponse });
  }
});

const getResponsesById = asyncHandler(async (req, res) => {
  const { formId } = req.params;

  const form = await Form.findById(formId);
  if (!form) {
    throw new ApiError(404, "Form not found");
  }

  const responses = await Response.find({ formId })
    .populate("formId", "formName")
    .select("responses submittedAt createdAt responseId");

  if (!responses || responses.length === 0) {
    throw new ApiError(404, "No responses found for this form");
  }

  const enrichedResponses = responses.map((response) => {
    const isSubmitted = response.responses.some(
      (res) => res.value === "form submit"
    );

    const enriched = form.fields.map((field) => {
      const existingResponseField = response.responses.find(
        (res) => res.fieldId.toString() === field._id.toString()
      );

      return {
        fieldId: field._id,
        value: existingResponseField
          ? existingResponseField.value
          : isSubmitted && field.inputType === "button"
          ? "form submit"
          : "",
        type: field.type || null,
        inputType: field.inputType || null,
        placeholder: field.placeholder || null,
      };
    });
    console.log(enriched);
    return {
      _id: response._id,
      formId: response.formId,
      responses: enriched,
      createdAt: response.createdAt,
      isSubmitted,
    };
  });

  res.status(200).json({
    message: "Responses retrieved successfully",
    formName: form.formName,
    responses: enrichedResponses,
    viewCount: form?.viewCount,
    startCount: form?.startCount,
    submitCount: form?.submitCount,
  });
});

export { submitForm, getResponsesById, partialResponses };
