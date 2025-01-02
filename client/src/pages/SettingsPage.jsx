import { React, useState } from "react";
import styles from "./styles/settings.module.css";
import { updateUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  LuUser,
  MdOutlineMail,
  RiLockPasswordLine,
  IoEyeOffOutline,
  IoEyeOutline,
  TbLogout,
} from "../utils/icons";
import useLogout from "../utils/logout";

const SettingsPage = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleToggleOldPassword = () => setShowOldPassword((prev) => !prev);
  const handleToggleNewPassword = () => setShowNewPassword((prev) => !prev);

  const { userUpdate: setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.username &&
      !formData.email &&
      !formData.password &&
      !formData.newPassword
    ) {
      toast.error("Add atleast one field to update");
      return;
    }
    if (formData.password && !formData.newPassword) {
      toast.error("Please enter a new password to change your password");
      return;
    }
    try {
      const response = await updateUser(formData);
      console.log(response.user);
      if (response.user) {
        toast.success("user updated successfully");
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
      }
    } catch (error) {
      console.error("Error while updating user", error);
    }
    setFormData({
      username: "",
      email: "",
      password: "",
      newPassword: "",
    });
  };

  const handleLogout = useLogout();
  return (
    <div className={styles.settings}>
      <div className={styles.formContainer}>
        <h1 className={styles.heading}>Settings</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputContainer}>
            <LuUser className={styles.icon} />
            <input
              id="username"
              value={formData.username}
              onChange={handleChange}
              type="text"
              placeholder="Name"
              className={styles.input}
            />
          </div>
          <div className={styles.inputContainer}>
            <MdOutlineMail className={styles.icon} />
            <input
              id="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Update Email"
              className={styles.input}
            />
          </div>
          <div className={styles.inputContainer}>
            <RiLockPasswordLine className={styles.icon} />
            <input
              id="password"
              value={formData.password}
              onChange={handleChange}
              type={showOldPassword ? "text" : "password"}
              placeholder="Old Password"
              className={styles.input}
            />
            <p onClick={handleToggleOldPassword}>
              {!showOldPassword ? (
                <IoEyeOffOutline className={styles.icon} />
              ) : (
                <IoEyeOutline className={styles.icon} />
              )}
            </p>
          </div>
          <div className={styles.inputContainer}>
            <RiLockPasswordLine className={styles.icon} />
            <input
              id="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              className={styles.input}
            />
            <p onClick={handleToggleNewPassword}>
              {!showNewPassword ? (
                <IoEyeOffOutline className={styles.icon} />
              ) : (
                <IoEyeOutline className={styles.icon} />
              )}
            </p>
          </div>

          <button type="submit" className={styles.updateBtn}>
            Update
          </button>
        </form>

        <button onClick={handleLogout} className={styles.logout}>
          <TbLogout /> Log out
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
