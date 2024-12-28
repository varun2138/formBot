import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../services/authService";
import axios from "axios";
const PublicForm = () => {
  const { id } = useParams();
  console.log(id);
  const [form, setForm] = useState(null);
  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/forms/${id}`);

      console.log(response.data.form);
      setForm(response.data.form);
    } catch (error) {
      console.log("error", error);
    }
  };

  console.log("form", form);

  return (
    <div>
      <h2>{form?.formName}</h2>
      {form?.fields.map((field, index) => (
        <div key={index}>
          {field.type === "bubble" && (
            <div className="bubble">
              <p>{field.text}</p>
            </div>
          )}

          {field.type === "input" && field.inputType !== "button" && (
            <div>
              <input type={field.inputType} placeholder={field.placeholder} />
              {/* <button>add</button> */}
            </div>
          )}
          {field.type === "input" && field.inputType === "button" && (
            <button className="" type="submit">
              {field.text || "submit"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default PublicForm;
