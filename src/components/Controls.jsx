import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Controls.css';

  const Controls = ({ onSend }) => {

  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();


  const handleSignOut = () => {
    navigate('/logout');
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const payload = {
      sender: "alice",
      recipient: "bob",
      chatId: 1,
      messageType: "TEXT",
      messageText: trimmed,
    };

  try {
    const response = await fetch("https://fs-dev.portnov.com/api/messages/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to send message");

    const savedMessage = await response.json();

    // Call parent to update UI
    onSend({ text: trimmed, isUser: true, attachment });

    setText("");
  } catch (err) {
    console.error("Error sending message:", err);
  }
};

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
    setAttachment(e.target.files[0]);
    }
  };

  return (
    <div className="controls-container" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message"
          rows={2}
          className="message-input"
          style={{
            flex: 1,
            borderRadius: '6px',
            padding: '8px',
            resize: 'none',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()&& !attachment}
          className="send-button"
          style={{
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            cursor: 'pointer',
            gap: '6px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7bb928"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          Send
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <button
            className="attach-button"
            type="button"
            onClick={handleAttachClick}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #7bb928',
              color: '#111',
              backgroundColor: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7bb928"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.44 11.05l-8.49 8.49a5 5 0 01-7.07-7.07l9.19-9.19a3 3 0 014.24 4.24l-9.19 9.19a1 1 0 01-1.41-1.41l8.49-8.49" />
            </svg>
            Attach file
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            multiple
          />
        </div>

        <button
          className="signout-button"
          onClick={handleSignOut}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            border: '1px solid #7bb928',
            color: '#111',
            backgroundColor: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7bb928"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 17l5-5-5-5M21 12H9M13 5V7a7 7 0 0 1 0 10v2" />
          </svg>
          Sign out
        </button>
     </div>
        {attachment && (
          <div style={{ marginTop: 8, fontSize: 16, color: '#111' }}>
            Selected file: {attachment.name}
          </div>
        )}
    </div>
  );
};

export default Controls;
