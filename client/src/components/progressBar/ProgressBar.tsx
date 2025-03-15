import React from "react";
import "./ProgressBar.scss";

const steps = [
  { label: "Publication" },
  { label: "Bidding" },
  { label: "Agreement Approval" },
  { label: "Reservation" },
  { label: "Project Execution" },
  { label: "Feedback Exchange" },
];

type ProgressBarProps = {
  step: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ step }) => {
  return (
    <div className="progress-bar">
      {steps.map((stepItem, index) => (
        <div
          key={index}
          className={`step ${index < step ? "completed" : ""} ${
            index === step ? "active" : ""
          }`}
        >
          {stepItem.label}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
