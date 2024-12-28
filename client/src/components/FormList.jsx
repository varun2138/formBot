import React from "react";
import styles from "./styles/formList.module.css";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
const FormList = ({
  forms,
  selectedFolder,
  selectedFolderForms,
  selectedSharedForms,
  openForm,
  userPermission,
  handleFormDeleteClick,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDeleteClick = (e, formId) => {
    e.stopPropagation();
    handleFormDeleteClick(formId);
  };
  const displayForms = selectedFolder
    ? selectedFolderForms
    : selectedSharedForms && selectedSharedForms.length > 0
    ? selectedSharedForms
    : forms;

  return (
    <div className={styles.forms}>
      {userPermission === "edit" && (
        <button className={styles.createForm} onClick={openForm}>
          <FaPlus className={styles.icon} /> Create a typebot
        </button>
      )}
      {displayForms && displayForms.length > 0 ? (
        displayForms.map((form) => (
          <div
            onClick={() => {
              if (user._id === form.creator) {
                navigate(`/forms/form/${form._id}`, {
                  state: { formName: form?.formName },
                });
              } else {
                toast.error("Not allowed for form creation");
              }
            }}
            className={styles.form}
            key={form._id}
          >
            <p>{form.formName}</p>
            {userPermission === "edit" && (
              <RiDeleteBin6Line
                onClick={(e) => handleDeleteClick(e, form._id)}
                className={styles.delete}
              />
            )}
          </div>
        ))
      ) : (
        <div>No forms available</div>
      )}
    </div>
  );
};

export default FormList;
