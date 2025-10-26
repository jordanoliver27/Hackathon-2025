import { useState } from "react";
import "./Grounding.css";
import clickSoundFile from "/Sounds/click.wav";
import clickSoundFile1 from "/Sounds/click1.wav";


const steps = [
  { label: "See", count: 5 },
  { label: "Touch", count: 4 },
  { label: "Hear", count: 3 },
  { label: "Smell", count: 2 },
  { label: "Taste", count: 1 },
];

export default function Grounding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState(Array(steps.length).fill([]));
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;
    const clickSound = new Audio(clickSoundFile1);
    clickSound.volume = 0.25;

    clickSound.play();

    const updatedInputs = [...inputs];
    updatedInputs[currentStep] = [...updatedInputs[currentStep], inputValue];
    setInputs(updatedInputs);
    setInputValue("");

    if (updatedInputs[currentStep].length + 1 > steps[currentStep].count) {
      if (currentStep + 1 < steps.length) {
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep(steps.length);
      }
    }
  };

  const handleRestart = () => {
    const clickSound = new Audio(clickSoundFile);
    clickSound.volume = 0.25;
    clickSound.play();
    setCurrentStep(0);
    setInputs(Array(steps.length).fill([]));
    setInputValue("");
  };

  if (currentStep >= steps.length) {
    return (
      <div className="grounding-container">
        <h1>Grounding Exercise</h1>
        <h2>All done — great job!</h2>
        <button style={{ marginTop: "1rem" }} onClick={handleRestart}>Do it again</button>

        <div className="summary">
          {steps.map((step, idx) => (
            <div key={idx} className="summary-step">
              <h3>{step.label}</h3>
              <div className="summary-items">
                {inputs[idx].map((item, i) => (
                  <span key={i} className="summary-item">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    );
  }

  const current = steps[currentStep];

  return (
    <div className="grounding-container">
      <h1>5-4-3-2-1 Grounding Exercise</h1>
      <h2>
        Step {currentStep + 1}: {current.count} things you can {current.label.toLowerCase()}
      </h2>

      <ul className="inputs-list">
        {inputs[currentStep].map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={`Enter one thing you can ${current.label.toLowerCase()}`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
