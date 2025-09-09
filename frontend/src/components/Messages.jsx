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
                className="message-file"
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const response = await fetch(m.file.url);
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const blob = await response.blob();
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = m.file.name;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    URL.revokeObjectURL(link.href);
                  } catch (err) {
                    console.error("Download failed:", err);
                  }
                }}
              >
                📎 {m.file.name}
              </a>
            )}
          </div>
        ))}
    </div>
  );
}
