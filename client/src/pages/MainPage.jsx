import React from "react";
import FormPage from "./FormPage";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      mainpage
      <p onClick={() => navigate("/formpage")}>login</p>
    </div>
  );
};

export default MainPage;
