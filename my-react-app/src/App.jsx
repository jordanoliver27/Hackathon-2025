import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "./App.css";

function App() {
  const [thought, setThought] = useState("");
  const [output, setOutput] = useState("");
  const [showCloud, setShowCloud] = useState(false);

  const handleRephrase = () => {
    if (!thought) return;
    // For demo
    const gentle = `This is a gentler way to say: "${thought}"`;
    setOutput(gentle);
    setShowCloud(true);
  };

  return (
    <div className="container">
      {/* Header */}
      <h1 className="title">RephraseIt</h1>
      <h2 className="subtitle">Turn harsh thoughts into gentle perspectives</h2>

      {/* Input */}
      <textarea
        className="input-box"
        placeholder="Type your negative thought here..."
        value={thought}
        onChange={(e) => setThought(e.target.value)}
      ></textarea>

      {/* Button */}
      <button className="rephrase-btn" onClick={handleRephrase}>
        Rephrase
      </button>

      {/* Cloud Output */}
      {showCloud && (
        <div className="cloud-output">
          {output}
        </div>
      )}
    </div>
  );
}

export default App;