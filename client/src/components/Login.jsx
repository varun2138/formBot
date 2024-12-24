import React, { useState } from "react";
import styles from "./styles/login.module.css";
import { FcGoogle } from "react-icons/fc";
import Input from "../ui/Input";
import { mapValidationErrors } from "../utils/validationErrors";
import { loginValidationSchema } from "../utils/validationSchemas";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = ({ toggleForm }) => {
  const { login: setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      await loginValidationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const response = await login(formData);
      navigate("/dashboard");
      if (response.user) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      setFormData({
        email: "",
        password: "",
      });
    } catch (validationErrors) {
      setErrors(mapValidationErrors(validationErrors));
    }
  };
  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
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

        <button className={styles.submitBtn} type="submit">
          {" "}
          Log In
        </button>
      </form>

      <p className={styles.text}>or</p>

      <button className={styles.GoogleBtn}>
        {/* logo */}
        <FcGoogle className={styles.icon} />
        Sign In with Google
      </button>

      <p className={styles.register}>
        Don't have an account ?{" "}
        <span onClick={toggleForm} className={styles.link}>
          Register now
        </span>{" "}
      </p>
    </div>
  );
};

export default Login;
