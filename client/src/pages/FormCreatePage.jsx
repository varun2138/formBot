import React from "react";
import { useParams } from "react-router-dom";

const FormCreatePage = () => {
  const { id } = useParams();
  return (
    <div>
      <h1>{id}</h1>
      form create
    </div>
  );
};

export default FormCreatePage;
