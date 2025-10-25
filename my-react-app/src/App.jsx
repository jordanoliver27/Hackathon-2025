import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import "./App.css";
 import { Link } from "react-router-dom";

function App() {
  const [thought, setThought] = useState("");
  const [output, setOutput] = useState("");
  const [showCloud, setShowCloud] = useState(false);
  const [colorTag, setColorTag] = useState(null);
  const [loading, setLoading] = useState(false); // ADDED

  const handleRephrase = async () => {
    if (!thought) return;

    // start breathing loader
    setLoading(true);
    setShowCloud(true);

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
      // stop breathing and show response
      setLoading(false);
      setShowCloud(true);
      setThought("");

    } catch (error) {
      console.error('Error calling server:', error);
      setColorTag(null);
      setOutput('Something went wrong. Please try again.');
      setLoading(false);
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

   <>
    {/* <div className="container"> */}
    <div className={`container ${output && !loading ? 'after-load' : ''}`}>
      {/* Header */}
      <h1 className="title">RephraseIt</h1>
      <h2 className="subtitle">Turn harsh thoughts into gentle perspectives</h2>

{/* Cloud Output */}
      {showCloud && (
        <div className="cloud-wrapper" key={output + loading}>
          {loading ? (
            // Enhanced loading state with message
            <div className="loading-container">
              <div className="breathing-person" aria-label="Loading..." />
              <div className="breathing-text">
                <span>Take a deep breath</span>
                <span className="dots">...</span>
              </div>
            </div>
          ) : (
            // Show cloud response when done loading
            <div
              className="cloud-text"
              style={{
                backgroundColor: bgColors[colorTag] || bgColors.null,
                color: '#0b0b0b',
              }}
            >
              {output}
            </div>
          )}
        </div>
      )}
{!loading && (
  <>
    <textarea
      className="input-box"
      placeholder="Type your thought here..."
      value={thought}
      onChange={(e) => setThought(e.target.value)}
    ></textarea>

    <button className="rephrase-btn" onClick={handleRephrase}>
      Rephrase
    </button>
  </>
)}

      
    
    </div>
    </>
  );
}

export default App;