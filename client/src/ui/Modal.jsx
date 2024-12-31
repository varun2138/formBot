import React from "react";
import styles from "../pages/styles/homepage.module.css";
const Modal = ({
  title,
  inputValue,
  onInputChange,
  placeholder,
  onConfirm,
  onCancel,
  isInputVisible = false,
  text,
}) => (
  <div className={styles.folderModal}>
    <div className={styles.openFolder}>
      <p>{title}</p>
      {isInputVisible && (
        <input
          type="text"
          className={styles.folderName}
          value={inputValue}
          onChange={onInputChange}
          placeholder={placeholder}
        />
      )}
      <div className={styles.buttons}>
        <button onClick={onConfirm} className={styles.createBtn}>
          {text}
        </button>
        <p>|</p>
        <button onClick={onCancel} className={styles.cancel}>
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default Modal;
