import React from "react";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import styles from "../pages/styles/publicform.module.css";
const Rating = ({ field, onSubmit }) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const handleCircleClick = (value) => {
    setSelectedRating(value);
  };

  return (
    <div key={field._id} className={styles.ratingField}>
      <div className={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((val) => (
          <div
            onClick={() => handleCircleClick(val)}
            key={val}
            className={`${styles.circle} ${
              selectedRating === val ? styles.selected : ""
            }`}
          >
            {val}
          </div>
        ))}
      </div>
      <button
        onClick={() => onSubmit(field._id, selectedRating)}
        disabled={selectedRating === null}
        className={styles.submitRating}
      >
        <IoSendSharp />
      </button>
    </div>
  );
};

export default Rating;
