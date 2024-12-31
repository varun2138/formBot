import React, { useEffect, useState } from "react";
import styles from "./styles/formpreview.module.css";
import {
  CiImageOn,
  RiDeleteBin6Line,
  LuMessageSquareText,
} from "../utils/icons";

const FormPreview = ({ initialFormFields = [], onDelete }) => {
  const [formFields, setFormFields] = useState(initialFormFields);
  const [focusedIndex, setFocusedIndex] = useState(null);
  useEffect(() => {
    setFormFields(initialFormFields);
  }, [initialFormFields]);

  const handleFieldChange = (index, newValue, fieldType) => {
    const updatedFormFields = [...formFields];
    if (fieldType === "bubble" && updatedFormFields[index].subtype === "text") {
      updatedFormFields[index].text = newValue;
    } else if (
      fieldType === "bubble" &&
      updatedFormFields[index].subtype === "image"
    ) {
      updatedFormFields[index].image = newValue;
    }
    setFormFields(updatedFormFields);
  };

  const getCounts = () => {
    const counts = {};
    return formFields.map((field, index) => {
      const typeKey = `${field.type}-${field.subtype}`;
      counts[typeKey] = (counts[typeKey] || 0) + 1;
      return { ...field, count: counts[typeKey], index };
    });
  };

  const fieldsWithCounts = getCounts();

  const getHintMessage = (subtype) => {
    switch (subtype) {
      case "text":
        return "Hint: User will input a text on his form.";
      case "number":
        return "Hint: User will input a number on his form.";
      case "email":
        return "Hint: User will input an email on his form.";
      case "phone":
        return "Hint: User will input a phone number on this form.";
      case "date":
        return "Hint: User will select a date.";
      case "rating":
        return "Hint: User will tap to rate out of 5.";
      default:
        return "";
    }
  };

  return (
    <div className={styles.formPreview}>
      {formFields.length === 0 ? (
        <div className={styles.noFields}>No fields added yet</div>
      ) : (
        fieldsWithCounts.map((field, index) => {
          switch (field.type) {
            case "bubble":
              return (
                <div key={index} className={styles.bubbleField}>
                  {field.subtype === "text" || field.inputType === "text" ? (
                    <div className={styles.bubbleBox}>
                      <p>Text {field.count}</p>
                      <div
                        className={`${styles.bubbleInput} ${
                          focusedIndex === index ? styles.outlined : ""
                        }`}
                      >
                        {focusedIndex === index && (
                          <LuMessageSquareText className={styles.icon} />
                        )}
                        <input
                          value={field.text || ""}
                          onChange={(e) =>
                            handleFieldChange(index, e.target.value, "bubble")
                          }
                          placeholder="Enter bubble text..."
                          onFocus={() => setFocusedIndex(index)}
                          onBlur={() => setFocusedIndex(null)}
                        />
                      </div>
                      <div className={styles.delete}>
                        {" "}
                        <RiDeleteBin6Line
                          onClick={() => onDelete(index)}
                        />{" "}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.bubbleBox}>
                      <p>Image {field.count}</p>
                      <div
                        className={`${styles.bubbleInput} ${
                          focusedIndex === index ? styles.outlined : ""
                        }`}
                      >
                        {focusedIndex === index && (
                          <CiImageOn className={styles.icon} />
                        )}
                        <input
                          type="text"
                          value={field.image || ""}
                          onChange={(e) =>
                            handleFieldChange(index, e.target.value, "bubble")
                          }
                          placeholder="Enter image URL..."
                          onFocus={() => setFocusedIndex(index)}
                          onBlur={() => setFocusedIndex(null)}
                        />
                      </div>

                      <div className={styles.delete}>
                        <RiDeleteBin6Line onClick={() => onDelete(index)} />{" "}
                      </div>
                    </div>
                  )}
                </div>
              );
            case "input":
              return (
                <div key={index} className={styles.inputField}>
                  <p>
                    {field.inputType === "button"
                      ? `submit Button`
                      : `Input   ${
                          field.subtype ? field.subtype : field.inputType
                        }
                          
                        
                  ${field.count}  `}
                  </p>
                  <p className={styles.hint}>
                    {getHintMessage(field.subtype) || field.placeholder}
                  </p>
                  <div className={styles.delete}>
                    <RiDeleteBin6Line onClick={() => onDelete(index)} />{" "}
                  </div>
                </div>
              );
            default:
              return null;
          }
        })
      )}
    </div>
  );
};

export default FormPreview;
