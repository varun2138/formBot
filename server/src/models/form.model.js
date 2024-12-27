import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    formName: { type: String, required: [true, "form name is required"] },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fields: [
      {
        type: { type: String, enum: ["bubble", "input"] },
        text: { type: String },
        image: {
          type: String,
        },
        inputType: {
          type: String,
          enum: ["text", "email", "number", "rating", "date", "button"],
          default: "text",
        },
        placeholder: { type: String },
      },
    ],
    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
    },

    isStandalone: {
      type: Boolean,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    startCount: {
      type: Number,
      default: 0,
    },
    submitCount: {
      type: Number,
      default: 0,
    },
    formLink: { type: String },
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", formSchema);
export default Form;
