import React, { useState, useEffect } from "react";
import UsernamePopup from "./UsernamePopup";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import "../styles/ChatApp.css";

export default function ChatApp() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [currentRoom, setCurrentRoom] = useState("global");

  useEffect(() => {
    if (!joined) return;

    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${wsProtocol}://${window.location.host}`);
    setSocket(ws);

    ws.onopen = () => console.log("WS open");

    ws.onmessage = (event) => {
      let parsed;
      try {
        parsed = JSON.parse(event.data);
      } catch (e) {
        console.error("Invalid WS message:", event.data);
        return;
      }
      console.log("WS onmessage received:", parsed);
      setMessages((prev) => [...prev, parsed]);
    };

    ws.onerror = (err) => console.error("WS error", err);
    ws.onclose = () => {
      console.log("WS closed");
      setSocket(null);
    };

    return () => {
      ws.close();
      setSocket(null);
    };
  }, [joined]);

  const sendMessage = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    if (input.trim() === "") return;

    const payload = {
      user: username,
      msg: input,
      room: currentRoom || "global",
    };

    console.log("Sending text payload:", payload);
    socket.send(JSON.stringify(payload));
    setInput("");
  };

  const sendFile = (fileData) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const payload = {
      user: username,
      msg: null,
      file: fileData,
      room: currentRoom || "global",
    };

    console.log("Sending file payload:", payload);
    socket.send(JSON.stringify(payload));
  };

  const createRoom = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const roomId = String(Math.floor(1000 + Math.random() * 9000));
    setCurrentRoom(roomId);
    socket.send(JSON.stringify({ type: "create-room", room: roomId, user: username }));
  };

  const joinRoom = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const roomId = prompt("Enter Room Number to join:");
    if (!roomId) return;

    setCurrentRoom(String(roomId));
    socket.send(JSON.stringify({ type: "join-room", room: String(roomId), user: username }));
  };

  if (!joined) {
    return <UsernamePopup username={username} setUsername={setUsername} onJoin={() => setJoined(true)} />;
  }

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-header">
          {currentRoom !== "global" ? `Private Room #${currentRoom}` : "Live Chat"}
          {currentRoom === "global" && (
            <>
              <button className="create-room-btn" onClick={createRoom}>Create Room</button>
              <button className="room-btn" onClick={joinRoom}>Join Room</button>
            </>
          )}
        </div>

        <Messages messages={messages} username={username} currentRoom={currentRoom} />

        <MessageInput input={input} setInput={setInput} sendMessage={sendMessage} sendFile={sendFile} />
      </div>
    </div>
  );
}
