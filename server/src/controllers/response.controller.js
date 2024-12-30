import Form from "../models/form.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import Response from "../models/responses.model.js";

const submitForm = asyncHandler(async (req, res) => {
  const { formId } = req.params;
  const { responses } = req.body;
  const form = await Form.findById(formId);

  if (!form) {
    throw new ApiError(404, "Form not found");
  }

  const formattedResponses = Object.keys(responses).map((fieldId) => ({
    fieldId,
    value: responses[fieldId],
  }));

  const newResponse = await Response.create({
    formId,
    responses: formattedResponses,
    submittedAt: new Date(),
  });

  form.submitCount += 1;
  await form.save();
  res.status(200).json({
    message: "Form submitted successfully ",
    response: newResponse,
    submitCount: form.submitCount,
  });
});

const partialResponses = async (req, res) => {
  const { formId, fieldId, value, responseId } = req.body;

  if (!responseId || !formId || !fieldId || value === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existingResponse = await Response.findOne({ responseId, formId });

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
  } catch (error) {
    console.error("Error saving partial response", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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
    const enriched = form.fields.map((field) => {
      const existingResponseField = response.responses.find(
        (res) => res.fieldId.toString() === field._id.toString()
      );

      return {
        fieldId: field._id,
        value: existingResponseField?.value || "",
        type: field.type || null,
        inputType: field.inputType || null,
        placeholder: field.placeholder || null,
      };
    });

    return {
      _id: response._id,
      formId: response.formId,
      responses: enriched,
      createdAt: response.createdAt,
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
