import { React, useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import styles from "./styles/formpage.module.css";
import image1 from "../assets/ellipse1.png";
import image2 from "../assets/ellipse2.png";
import image3 from "../assets/polygon.png";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
const FormPage = () => {
  const [formType, setFormType] = useState(false);
  const toggleForm = () => {
    setFormType(!formType);
  };
  const navigate = useNavigate();
  return (
    <div className={styles.formContainer}>
      <FaArrowLeftLong onClick={() => navigate("/")} className={styles.icon} />
      <div className={styles.imageContainer}>
        <img src={image1} alt="" className={styles.image1} />
      </div>
      <div className={styles.imageContainer}>
        <img src={image2} alt="" className={styles.image2} />
      </div>
      <div className={styles.imageContainer}>
        <img src={image3} alt="" className={styles.image3} />
      </div>

      <div className={styles.formTypes}>
        {formType ? (
          <Signup toggleForm={toggleForm} />
        ) : (
          <Login toggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default FormPage;
