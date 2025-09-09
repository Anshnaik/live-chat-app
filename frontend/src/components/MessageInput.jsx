import React, { useRef, useEffect } from "react";
import "../styles/MessageInput.css";

export default function MessageInput({ input, setInput, sendMessage, sendFile }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const el = inputRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [input]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("Selected file for upload:", file.name, file.size, file.type);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Upload response:", data);

      if (data.url) {
        sendFile({ url: data.url, name: file.name });
      }
    } catch (err) {
      console.error("File upload failed:", err);
    }
    e.target.value = "";
  };

  return (
    <div className="message-input">
      <textarea
        ref={inputRef}
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        placeholder="Type a message..."
      />
      <label className="file-upload">
        📎
        <input type="file" style={{ display: "none" }} onChange={handleFileChange} />
      </label>
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
