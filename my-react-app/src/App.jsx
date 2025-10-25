import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "./App.css";

function App() {
  const [thought, setThought] = useState("");
  const [output, setOutput] = useState("");
  const [showCloud, setShowCloud] = useState(false);
  const [colorTag, setColorTag] = useState(null);

  const handleRephrase = async () => {
    if (!thought) return;

    try {
      const response = await fetch('http://localhost:3000/api/rephrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: thought }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();

      
      const match = (data.rephrased || "").match(/^\s*(?:\[(RED|ORANGE|GREEN)\]|(RED|ORANGE|GREEN))\s*(.*)$/i);
      const color = (match && (match[1] || match[2])) ? (match[1] || match[2]).toUpperCase() : null;
      if (match) {
        setColorTag(color);
        setOutput(match[3] || "");
      } else {
        setColorTag(null);
        setOutput(data.rephrased || "No rephrase returned.");
      }
      setShowCloud(true);

    } catch (error) {
      console.error('Error calling server:', error);
      setColorTag(null);
      setOutput('Something went wrong. Please try again.');
      setShowCloud(true);
    }
  };

  const bgColors = {
    RED: '#ff6b6b',
    ORANGE: '#ffb86b',
    GREEN: '#a8e6cf',
    null: '#f0f0f0'
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
        onChange={(e) => {
          setThought(e.target.value);
          setColorTag(null);     
          setShowCloud(false);   
        }}
      ></textarea>

      {/* Button */}
      <button className="rephrase-btn" onClick={handleRephrase}>
        Rephrase
      </button>
      
      {/* Cloud Output */}
      {showCloud && (
        <div className="cloud-wrapper">
            <div className="puff puff-left" style={{
            backgroundColor: bgColors[colorTag] || bgColors.null}}></div>
            <div className="puff puff-right" style={{
            backgroundColor: bgColors[colorTag] || bgColors.null}}></div>

        
        <div
          className="cloud-text"
          style={{
            backgroundColor: bgColors[colorTag] || bgColors.null, 
            color: '#0b0b0b',
          }}
        >
          {output}
          </div>
          
        </div>
      )}
    </div>
  );
}

export default App;