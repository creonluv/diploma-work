import React from "react";
import "./ProgressBarMini.scss";

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

const ProgressBarMini: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="progress-mini-container">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="#edeef0"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="#4f7bcd"
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
        />
        <text x="50%" y="50%" textAnchor="middle" dy="0.4em" fontSize="14">
          {currentStep + 1} з {totalSteps}
        </text>
      </svg>
      <div className="progress-mini-text">
        <strong>{steps[currentStep].label}</strong>
        <p>
          Next step:{" "}
          {steps[currentStep + 1] ? steps[currentStep + 1].label : "Завершено"}
        </p>
      </div>
    </div>
  );
};

export default ProgressBarMini;
