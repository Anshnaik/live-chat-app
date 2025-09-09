import React from "react";
import "../styles/Messages.css";

export default function Messages({ messages, username, currentRoom }) {
  return (
    <div className="messages">
      {messages
        .filter((m) => (m.room || "global") === (currentRoom || "global"))
        .map((m, idx) => (
          <div
            key={idx}
            className={`message-row ${m.user === username ? "self" : "other"}`}
          >
            <span className="message-user">{m.user}</span>

            {m.msg && <span className="message-text">{m.msg}</span>}

            {m.file && (
              <a
                href={m.file.url}
                download={m.file.name} // forces download
                className="message-file"
              >
                📎 {m.file.name}
              </a>
            )}
          </div>
        ))}
    </div>
  );
}
