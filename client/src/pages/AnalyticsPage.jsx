import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { analytics } from "../services/formService";

const AnalyticsPage = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState({});
  const [count, setCount] = useState(null);
  console.log(id);

  useEffect(() => {
    getResponses();
  }, [id]);
  const getResponses = async () => {
    try {
      const data = await analytics(id);
      setResponses(data.responses);
      setCount(data);
      console.log(data);
    } catch (error) {
      console.error("error in analytics", error);
    }
  };
  //   console.log(responses[0].createdAt);
  console.log(count?.viewCount);
  return (
    <div>
      <h1>Analytics</h1>
    </div>
  );
};

export default AnalyticsPage;
