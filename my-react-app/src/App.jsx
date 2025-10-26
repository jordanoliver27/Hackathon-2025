import { useState, useRef, useEffect } from 'react';
import "./App.css";
import { Link } from "react-router-dom";
import clickSoundFile from "/Sounds/click.wav";
import clickSoundFile1 from "/Sounds/click1.wav";

function App() {
  const [thought, setThought] = useState("");
  const [output, setOutput] = useState("");
  const [showCloud, setShowCloud] = useState(false);
  const [colorTag, setColorTag] = useState(null);
  const [loading, setLoading] = useState(false);
  const clickSound = new Audio(clickSoundFile);
  const clickSound1 = new Audio(clickSoundFile1);

  const handleRephrase = async () => {
    if (!thought) return;
    clickSound1.play();
    setLoading(true);
    setShowCloud(true);

    try {
      const response = await fetch('https://rephraseit-m3rz.onrender.com/api/rephrase', {
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
        setOutput((match[3] || "").trim().replace(/^:\s*/, ""));
      } else {
        setColorTag(null);
        setOutput((data.rephrased || "No rephrase returned.").trim().replace(/^:\s*/, ""));

      }
      setLoading(false);
      setShowCloud(true);
      setThought("");
      clickSound.play();

    } catch (error) {
      console.error('Error calling server:', error);
      setColorTag(null);
      setOutput('Something went wrong. Please try again.');
      setLoading(false);
      setShowCloud(true);
    }

  };

  const bgColors = {
    RED: '#f1a9a9ff',
    ORANGE: '#ffb86b',
    GREEN: '#a8e6cf',
    null: '#f0f0f0'
  };


  return (

    <>
      <div className={`container ${output && !loading ? 'after-load' : ''}`}>
        <h1 className="title">RephraseIt</h1>
        <h2 className="subtitle">Turn harsh thoughts into gentle perspectives</h2>


        {showCloud && (
          <div className="cloud-wrapper" key={output + loading}>
            {loading ? (
              <div className="loading-container">
                <div className="breathing-person" aria-label="Loading..." />
                <div className="breathing-text">
                  <span>Take a deep breath</span>
                  <span className="dots">...</span>
                </div>
              </div>
            ) : (
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleRephrase();   // trigger submit function
                }
              }}
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