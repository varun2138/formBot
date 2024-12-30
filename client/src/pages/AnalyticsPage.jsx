import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { analytics } from "../services/formService";
import styles from "./styles/analytics.module.css";

import AnalyticsPieChart from "../components/AnalyticsPieChart";
const AnalyticsPage = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [viewCount, setViewCount] = useState(0);
  const [startCount, setStartCount] = useState(0);
  const [submitCount, setSubmitCount] = useState(0);
  console.log(id);

  useEffect(() => {
    getResponses();
  }, [id]);

  const getResponses = async () => {
    try {
      const data = await analytics(id);
      console.log(data);
      setResponses(data?.responses || []);
      setViewCount(data.viewCount);
      setStartCount(data.startCount);
      setSubmitCount(data.submitCount);
    } catch (error) {
      console.error("error in analytics", error);
    }
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formattedDateTime = date.toLocaleString("en-US", options);

    return formattedDateTime.replace(",", " ");
  };

  const tableHeaders = () => {
    if (responses.length === 0) return null;
    const headers = [];
    let counters = {};
    const fields = responses[0].responses.slice(0, -1);
    fields.forEach((field) => {
      if (field.type === "input" && field.inputType) {
        const key = `${field.inputType}${counters[field.inputType] || 1}`;
        headers.push(key);
        counters[field.inputType] = (counters[field.inputType] || 0) + 1;
      }
    });

    const allHeaders = ["Submitted At", ...headers];
    return (
      <tr>
        <th></th>
        {allHeaders.map((header, idx) => (
          <th key={idx}>{header}</th>
        ))}
      </tr>
    );
  };
  const tableData = () => {
    return responses.map((response, index) => {
      const formattedData = {};
      let counters = {};

      formattedData["Submitted At"] = formatDateTime(response.createdAt);
      const fields = response.responses.slice(0, -1);

      fields.forEach((field) => {
        if (field.type === "input" && field.inputType) {
          const key = `${field.inputType}${counters[field.inputType] || 1}`;
          formattedData[key] = field.value || "";
          counters[field.inputType] = (counters[field.inputType] || 0) + 1;
        }
      });

      return (
        <tr key={response._id}>
          <td>{index + 1}</td>
          {Object.values(formattedData).map((value, idx) => (
            <td key={idx}>{value}</td>
          ))}
        </tr>
      );
    });
  };

  const submissionPercentage = (submitCount / viewCount) * 100;
  const viewPercentage = 100 - submissionPercentage;

  if (responses.length === 0) {
    return (
      <div className={styles.noResponses}>
        <p>No responses yet collected</p>
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.countValues}>
        <div className={styles.value}>
          <p>Views</p>
          <span>{viewCount}</span>
        </div>
        <div className={styles.value}>
          <p>Start</p>
          <span>{startCount}</span>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>{tableHeaders()}</thead>
          <tbody>{tableData()}</tbody>
        </table>
      </div>

      <div className={styles.pieChartContainer}>
        <AnalyticsPieChart
          submissionPercentage={submissionPercentage}
          viewPercentage={viewPercentage}
          submitCount={submitCount}
        />
        <p className={styles.rate}>
          Completion rate <span>{Math.round(submissionPercentage)} %</span>
        </p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
