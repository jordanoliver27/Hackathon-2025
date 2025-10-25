import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Breathing.css";

export default function Breathing() {
  const [step, setStep] = useState(0);
  const [timer, setTimer] = useState(0);

  const steps = [
    { action: "Inhale", duration: 4 },
    { action: "Exhale", duration: 8 },
    { action: "Hold", duration: 7 },

  ];

  useEffect(() => {
    let interval;
    if (step < steps.length) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev + 1 >= steps[step].duration) {
            setStep((s) => (s + 1) % steps.length); // loop continuously
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const current = steps[step];

  // Circle scale based on phase
  let scale = 1;
  if (current.action === "Inhale") {
    scale = 1.5*(0.1+ (timer + 1) / current.duration); // grows from 0 → 1
  } else if (current.action === "Exhale") {
    scale = 1.5*(0.1+ 1 - (timer + 1) / current.duration); // shrinks from 1 → 0
  } else if (current.action === "Hold") {
    scale = 1.5*(0.1+1); // stays full
  }

  return (
    <div className="breathing-page">
      <h2>{current.action}</h2>

      <div className="circle-container">
        <div className="circle" style={{ transform: `scale(${scale})` }}></div>
      </div>

      <p className="counter">{timer + 1} / {current.duration} seconds</p>

    </div>
  );
}
