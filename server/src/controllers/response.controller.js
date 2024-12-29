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

const getResponsesById = asyncHandler(async (req, res) => {
  const { formId } = req.params;

  // Fetch the form and populate the fields
  const form = await Form.findById(formId);
  console.log(form);
  if (!form) {
    throw new ApiError(404, "Form not found");
  }

  // Fetch the responses for the given formId
  const responses = await Response.find({ formId })
    .populate("formId", "formName")
    .select("responses submittedAt createdAt");

  if (!responses || responses.length === 0) {
    throw new ApiError(404, "No responses found for this form");
  }

  // Map responses to their respective fields
  const enrichedResponses = responses.map((response) => {
    // console.log(response);
    const enriched = response.responses.map((fieldResponse) => {
      const field = form.fields.find(
        (f) => f._id.toString() === fieldResponse.fieldId.toString()
      );

      // console.log(field);

      return {
        fieldId: fieldResponse.fieldId,
        value: fieldResponse.value,
        type: field?.type || null,
        inputType: field?.inputType || null,
        placeholder: field?.placeholder || null,
        text: field?.text || null,
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

export { submitForm, getResponsesById };
