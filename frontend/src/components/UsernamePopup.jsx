import React, { useState } from "react";
import "../styles/UsernamePopup.css";

export default function UsernamePopup({ setUsername, onJoin }) {
  const [tempName, setTempName] = useState("");

  const handleJoin = () => {
    if (tempName.trim() !== "") {
      setUsername(tempName);
      onJoin(); // tells ChatApp that user has joined
    }
  };

  return (
  <div className="popup-overlay">
    <div className="popup-box">
      <h2>Enter Username</h2>
      <input
        value={tempName}
        onChange={(e) => setTempName(e.target.value)}
        placeholder="Your name..."
        onKeyDown={(e) => e.key === "Enter" && handleJoin()}
      />
      <button onClick={handleJoin}>Join</button>
    </div>
  </div>
);

}
