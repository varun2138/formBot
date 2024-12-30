import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import styles from "./styles/formcreate.module.css";
import ThemeToggle from "../components/ThemeToggle";
import { IoMdClose } from "react-icons/io";
import { GrFlagFill } from "react-icons/gr";
import Sidebar from "../components/Sidebar";
import FormPreview from "../components/FormPreview";
import { addFieldsToForm, getProtectedForm } from "../services/formService";
import { toast } from "react-hot-toast";
import AnalyticsPage from "./AnalyticsPage";
const FormCreatePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const formName = location.state?.formName;
  const [link, setLink] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [activeTab, setActiveTab] = useState("flow");
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await getProtectedForm(id);
        console.log(response);
        console.log(response.form.fields);
        console.log(response.form.formLink);
        if (response?.form?.fields) {
          setFormFields(response.form.fields);
          setLink(response.form.formLink);
        }
      } catch (error) {
        console.error("failed to fetch fields", error);
      }
    };
    fetchFields();
  }, [id]);

  const handleFeildAdd = (field) => {
    console.log("Adding field:", field);

    if (
      field.type === "input" &&
      field.subtype === "button" &&
      formFields.some((f) => f.subtype === "button")
    ) {
      return;
    }
    setFormFields((prevFields) => [...prevFields, field]);
  };

  const handleFieldDelete = (indextoDelete) => {
    setFormFields((prevFields) =>
      prevFields.filter((_, index) => index !== indextoDelete)
    );
  };
  const handleSave = async (fields) => {
    if (fields.length === 0 || fields[fields.length - 1].subtype !== "button") {
      toast.error("form must end with a submit button");
      return;
    }

    try {
      const response = await addFieldsToForm(id, fields);

      if (response?.form?.formLink) {
        setLink(response.form.formLink);
        setIsSaved(true);
        toast.success("Form saved successfully");
      }
      console.log("form updated", response);
    } catch (error) {
      console.error("Failed to save form", error);
    }
  };
  const handleShareBtn = () => {
    if (link) {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          toast.success("Form Link copied to clipboard");
        })
        .catch((error) => {
          console.error("failed to copy form link", error);
          toast.error("failed to copy form link");
        });
    }
  };

  console.log(formFields.length);
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <p className={styles.formName}>{formName}</p>
        <div className={styles.buttons}>
          <button
            onClick={() => setActiveTab("flow")}
            className={`${styles.flow} ${
              activeTab === "flow" ? styles.active : ""
            }`}
          >
            Flow
          </button>
          <button
            onClick={() => setActiveTab("response")}
            className={`${styles.response} ${
              activeTab === "response" ? styles.active : ""
            }`}
          >
            Response
          </button>
        </div>
        <div className={styles.endButtons}>
          <ThemeToggle />
          <button
            className={`${styles.share} ${!isSaved ? styles.disable : ""}`}
            onClick={handleShareBtn}
            disabled={!isSaved}
          >
            share
          </button>
          <button
            onClick={() => handleSave(formFields)}
            className={styles.save}
          >
            save
          </button>

          <IoMdClose
            onClick={() => {
              navigate("/dashboard");
            }}
            className={styles.back}
          />
        </div>
      </nav>
      <div className={styles.formCreation}>
        {activeTab === "flow" ? (
          <>
            <div className={styles.sidebar}>
              <Sidebar onFieldAdd={handleFeildAdd} />
            </div>
            <div className={styles.mainPage}>
              <div className={styles.fields}>
                <div className={styles.start}>
                  {" "}
                  <GrFlagFill className={styles.flag} /> Start
                </div>
                <FormPreview
                  initialFormFields={formFields}
                  onDelete={handleFieldDelete}
                />
              </div>
            </div>
          </>
        ) : (
          <AnalyticsPage />
        )}
      </div>
    </div>
  );
};

export default FormCreatePage;
