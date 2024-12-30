import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../services/authService";
import axios from "axios";
import styles from "./styles/publicform.module.css";
import { IoSendSharp } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Rating from "../ui/Rating";
import toast from "react-hot-toast";
const PublicForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [displayedFields, setDisplayedFields] = useState([]);
  const [localValue, setLocalValue] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [responseId, setResponseId] = useState(null);

  const generateResponseId = () => {
    const newResponseId = new Date().getTime().toString();
    setResponseId(newResponseId);
  };

  useEffect(() => {
    generateResponseId();
  }, []);

  const handleInteraction = async () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    try {
      await axios.get(`${BACKEND_URL}/forms/start/${id}`);
    } catch (error) {
      console.log("Error incrementing start count:", error);
    }
  };

  useEffect(() => {
    fetchForm();
  }, [id]);

  const submitPartialResponse = async (formId, fieldId, value) => {
    if (!responseId) {
      console.error("response id is missing");
      return;
    }
    const responseData = {
      formId,
      fieldId,
      value,
      responseId,
    };

    try {
      const response = await axios.post(
        `${BACKEND_URL}/responses/form/${formId}`,
        responseData
      );

      console.log("partial response saved", response.data);
    } catch (error) {
      console.error("Error saving partial response", error);
    }
  };

  const fetchForm = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/forms/${id}`);
      setForm(response.data.form);
    } catch (error) {
      console.error("Error fetching form:", error);
    }
  };

  const handleInputChange = (e) => {
    const fieldId = e.target.name;
    setLocalValue(e.target.value);

    // submitPartialResponse(id, fieldId, e.target.value);
  };

  const submitFormResponses = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/responses/forms/form/${id}`,
        { responses }
      );
      console.log(response);
      toast.success("form submitted successfully");
    } catch (error) {
      console.error("Error submiting");
      toast.error("error submitting form");
    }
  };
  const handleSubmit = (fieldId, fieldInputType) => {
    if (
      fieldInputType === "text" ||
      fieldInputType === "email" ||
      fieldInputType === "number"
    ) {
      if (localValue.trim() === "") {
        toast.error("please provide a response");
        return;
      }

      if (fieldInputType === "email" && !validateEmail(localValue)) {
        toast.error("Please enter a valid email address");
        return;
      }
      if (fieldInputType === "number" && !validatePhoneNumber(localValue)) {
        toast.error("Please enter valid 10-digit mobile number");
        return;
      }
      setResponses((prevResponses) => ({
        ...prevResponses,
        [fieldId]: localValue,
      }));

      submitPartialResponse(id, fieldId, localValue);

      if (!hasInteracted) {
        handleInteraction();
      }
      setLocalValue("");
      goToNextField();
    } else if (fieldInputType === "date") {
      if (!startDate) {
        toast.error("Please select a date");
        return;
      }
      setResponses((prevResponses) => ({
        ...prevResponses,
        [fieldId]: startDate.toLocaleDateString(),
      }));

      submitPartialResponse(id, fieldId, startDate.toLocaleDateString());

      if (!hasInteracted) {
        handleInteraction();
      }
      setStartDate(null);
      goToNextField();
    } else if (fieldInputType === "button") {
      setResponses((prevResponses) => ({
        ...prevResponses,
        [fieldId]: "submit form",
      }));
      goToNextField();
    }
    console.log(fieldId, fieldInputType);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(number);
  };

  const goToNextField = () => {
    if (form && currentFieldIndex < form.fields.length - 1) {
      setCurrentFieldIndex((prevIndex) => {
        return prevIndex + 1;
      });
    } else {
      console.log(responses);
    }
  };

  const renderField = (field) => {
    const response = responses[field._id];

    if (field.type === "bubble") {
      if (!responses[field._id]) {
        setResponses((prevResponses) => ({
          ...prevResponses,
          [field._id]: field.text || field.image,
        }));
      }
      return (
        <div key={field._id} className={styles.bubble}>
          {field.image ? (
            <div className={styles.imageContainer}>
              <img
                src={field.image}
                alt="Bubble image"
                className={styles.bubbleImage}
              />
            </div>
          ) : null}
          {field.text ? (
            <p className={styles.bubbleText}>{field.text}</p>
          ) : null}
        </div>
      );
    }

    if (field.type === "input") {
      if (
        field.inputType === "text" ||
        field.inputType === "email" ||
        field.inputType === "number"
      ) {
        return (
          <div key={field._id} className={styles.inputField}>
            {response === undefined ? (
              <div className={styles.inputContainer}>
                <input
                  type={field.inputType}
                  name={field._id}
                  placeholder={field.placeholder || "Enter your response"}
                  value={localValue}
                  onChange={handleInputChange}
                  required
                />
                <button
                  onClick={() => handleSubmit(field._id, field.inputType)}
                >
                  <IoSendSharp />
                </button>
              </div>
            ) : (
              <div className={styles.response}>
                <p>{response}</p>
              </div>
            )}
          </div>
        );
      }

      if (field.inputType === "date") {
        return (
          <div key={field._id} className={styles.inputField}>
            {response === undefined ? (
              <div className={styles.inputContainer}>
                <DatePicker
                  placeholderText={field.placeholder || "Enter your date"}
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
                <button
                  onClick={() => handleSubmit(field._id, field.inputType)}
                >
                  <IoSendSharp />
                </button>
              </div>
            ) : (
              <div className={styles.response}>
                <p>{response}</p>
              </div>
            )}
          </div>
        );
      }

      if (field.inputType === "rating") {
        return (
          <div key={field._id} className={styles.inputField}>
            {response === undefined ? (
              <Rating
                key={field._id}
                field={field}
                onSubmit={(fieldId, rating) => {
                  if (rating !== null) {
                    setResponses((prevResponses) => ({
                      ...prevResponses,
                      [fieldId]: rating,
                    }));
                    goToNextField();
                  } else {
                    alert("select a rating");
                  }
                }}
              />
            ) : (
              <div className={styles.response}>
                <p>{response}</p>
              </div>
            )}
          </div>
        );
      }
    }

    if (field.inputType === "button") {
      return (
        <div key={field._id} className={styles.buttonField}>
          <button
            onClick={() => {
              handleSubmit(field._id, field.inputType);
              submitFormResponses();
            }}
          >
            {field.placeholder || "Submit Form"}
          </button>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    if (form && currentFieldIndex < form.fields.length) {
      const currentField = form.fields[currentFieldIndex];

      if (!displayedFields.some((field) => field._id === currentField._id)) {
        setDisplayedFields((prev) => [...prev, currentField]);
      }
      if (currentField.type === "bubble") {
        setIsInputVisible(false);
        const timeout = setTimeout(() => {
          goToNextField();
        }, 1000);

        return () => clearTimeout(timeout);
      } else {
        setIsInputVisible(true);
      }
    }
  }, [form, currentFieldIndex, displayedFields]);

  return (
    <div className={styles.formContainer}>
      {form ? (
        <div className={styles.form}>
          <div className={styles.bubbleContainer}>
            {displayedFields.map((field) => renderField(field))}
          </div>
        </div>
      ) : (
        <p>Loading form...</p>
      )}
    </div>
  );
};

export default PublicForm;
