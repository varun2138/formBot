import React from "react";
import styles from "../components/styles/login.module.css";

const Input = ({ label, id, type, value, onChange, error }) => (
  <div className={styles.inputContainer}>
    <label
      htmlFor={id}
      className={`${styles.label} ${error ? styles.errorLabel : ""}`}
    >
      {label}
    </label>
    <input
      className={styles.input}
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={`Enter ${label.toLowerCase()}`}
    />
    {error && <p className={styles.error}>{error}</p>}
  </div>
);

export default Input;
