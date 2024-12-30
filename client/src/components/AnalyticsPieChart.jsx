import React from "react";
import { PieChart } from "react-minimal-pie-chart";
import styles from "../pages/styles/analytics.module.css";
const AnalyticsPieChart = ({
  submissionPercentage,
  viewPercentage,
  submitCount,
}) => {
  return (
    <div className={styles.chartContainer}>
      <PieChart
        className={styles.pieChart}
        data={[
          {
            title: "Submissions",
            value: submissionPercentage,
            color: "#3b82f6",
          },
          {
            title: "Remaining Views",
            value: viewPercentage,
            color: "#909090",
          },
        ]}
        width
        lineWidth={30}
        startAngle={-90}
      />

      <div className={styles.submission}>
        {" "}
        Completed <span>{submitCount}</span>
      </div>
    </div>
  );
};

export default AnalyticsPieChart;
