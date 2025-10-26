import { Outlet } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import NavBar from "./NavBar";

export default function Layout() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/Sounds/ambient.mp3");
    audioRef.current.loop = true;

    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.log("Autoplay prevented:", err));
    }
    setPlaying(!playing);
  };

  return (
    <div>
      <NavBar />
       <Outlet />
    <div>
      <button className="sound-btn" onClick={toggleSound}>
        {playing ? "🔊 Stop Sound" : "🔈 Play Ambient Sound"}
      </button>

    </div>
    </div>
  );
}
