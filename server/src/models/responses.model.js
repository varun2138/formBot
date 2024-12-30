import mongoose, { mongo } from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    responseId: {
      type: String,
      unique: true,
    },
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
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    submiitedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Response = mongoose.model("Response", responseSchema);
export default Response;
