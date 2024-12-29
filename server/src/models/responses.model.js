import mongoose, { mongo } from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    responses: [
      {
        fieldId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        value: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
        },
      },
    ],
    submiitedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const Response = mongoose.model("Response", responseSchema);
export default Response;
