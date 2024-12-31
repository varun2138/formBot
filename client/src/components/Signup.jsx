import React, { useState } from "react";
import styles from "./styles/login.module.css";
import { FcGoogle } from "react-icons/fc";
import { SignupValidationSchema } from "../utils/validationSchemas";
import { mapValidationErrors } from "../utils/validationErrors";
import Input from "../ui/Input";
import { register } from "../services/authService";

const Signup = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await SignupValidationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const data = await register(formData);

      console.log("register data", data);
      console.log("Form Data:", formData);
      toggleForm();
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (validationErrors) {
      setErrors(mapValidationErrors(validationErrors));
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Username"
          id="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
        />

        <Input
          label="Email"
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Input
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <button className={styles.submitBtn} type="submit">
          Sign Up
        </button>
      </form>

      <p className={styles.text}>or</p>

      <button className={styles.GoogleBtn}>
        <FcGoogle className={styles.icon} />
        Sign In with Google
      </button>

      <p className={styles.register}>
        Already have an account?{" "}
        <span onClick={toggleForm} className={styles.link}>
          Login
        </span>
      </p>
    </div>
  );
};

export default Signup;
