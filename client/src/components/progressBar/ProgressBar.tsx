import React from "react";
import "./ProgressBar.scss";

const steps = [
  { label: "Publication", completed: true },
  { label: "Bidding", completed: true },
  { label: "Agreement Approval", completed: false },
  { label: "Reservation", completed: false },
  { label: "Project Execution", completed: false },
  { label: "Feedback Exchange", completed: false },
];

interface ProgressBarProps {
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <div className="progress-bar">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${index < currentStep ? "completed" : ""} ${
            index === currentStep ? "active" : ""
          }`}
        >
          {step.label}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
