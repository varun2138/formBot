// src/hooks/useLogout.js
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logout } from "../services/authService";

const useLogout = () => {
  const { logoutContext } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();

      logoutContext();

      localStorage.removeItem("user");

      toast.success("Logged out successfully");

      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return handleLogout;
};

export default useLogout;
