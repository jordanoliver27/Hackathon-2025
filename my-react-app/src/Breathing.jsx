import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Breathing.css";

export default function Breathing() {
  const steps = [
    { action: "Inhale", duration: 4 },
    { action: "Hold", duration: 7 },
    { action: "Exhale", duration: 8 },
  ];

  const [step, setStep] = useState(0);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let stepIndex = 0;
    let timerValue = 0;

    const interval = setInterval(() => {
      timerValue++;

      if (timerValue >= steps[stepIndex].duration) {
        stepIndex = (stepIndex + 1) % steps.length;
        timerValue = 0;
      }

      setStep(stepIndex);
      setTimer(timerValue);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const current = steps[step];

  let scale = 1;
  if (current.action === "Inhale") {
    scale = 1.5 * (0.1 + (timer + 1) / current.duration);
  } else if (current.action === "Hold") {
    scale = 1.5 * (0.1 + 1); 
  } else if (current.action === "Exhale") {
    scale = 1.5 * (0.1 + 1 - (timer + 1) / current.duration); // shrinks
  }

  return (
    <div className="breathing-page">
      <h2>{current.action}</h2>

      <div className="circle-container">
        <div
          className="circle"
          style={{ transform: `scale(${scale})` }}
        ></div>
      </div>

      <p className="counter">
        {timer + 1} / {current.duration} seconds
      </p>

    </div>
  );
}
