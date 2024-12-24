import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import HomePage from "./pages/HomePage";
import FormPage from "./pages/FormPage";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import SettingsPage from "./pages/SettingsPage";
const App = () => {
  const { user } = useAuth();

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : isDesktop ? (
                <MainPage />
              ) : (
                <FormPage />
              )
            }
          />
          <Route
            path="/dashboard"
            element={user ? <HomePage /> : <Navigate to="/" />}
          />
          <Route
            path="/formpage"
            element={user ? <Navigate to="/dashboard" /> : <FormPage />}
          />
          <Route
            path="/settings"
            element={user ? <SettingsPage /> : <Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
};

export default App;
