import React from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./styles/toggle.module.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useAuth();
  const handleClick = () => {
    console.log("Toggle clicked");
    toggleTheme();
  };

  return (
    <div className={styles.toggleContainer}>
      <p className={styles.mode}>Light</p>
      <div
        onClick={handleClick}
        className={`${styles.toggle} ${theme === "dark" ? styles.dark : ""}`}
      >
        <div
          className={`${styles.knob} ${
            theme === "dark" ? styles.knobDark : ""
          }`}
        ></div>
      </div>
      <p className={styles.mode}>Dark</p>
    </div>
  );
};

export default ThemeToggle;
