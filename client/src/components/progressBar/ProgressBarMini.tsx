import "./ProgressBarMini.scss";
import React from "react";
import "./ProgressBar.scss";
import { steps } from "../../helpers/steps";

type ProgressBarMiniProps = {
  step: number;
};

const ProgressBarMini: React.FC<ProgressBarMiniProps> = ({ step }) => {
  const totalSteps = steps.length;
  const progress = (step / totalSteps) * 100;
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
          {step + 1} з {totalSteps}
        </text>
      </svg>
      <div className="progress-mini-text">
        <strong>{steps[step].label}</strong>
        <p>
          Next step: {steps[step + 1] ? steps[step + 1].label : "Завершено"}
        </p>
      </div>
    </div>
  );
};

export default ProgressBarMini;
