import { useState } from 'react';
import './Message.css';

function Message() {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    setMessage(text);
    setText('');
  };

  return (
    <div className="message-container">
    
      <input
        type="text"
        value={text}
        placeholder="Type your message here..."
        onChange={(e) => setText(e.target.value)}
        autoFocus
        maxLength={100}
        className="message-input"
    />
       
      <button 
        onClick={handleSend} 
        disabled={!text.trim()} 
        className="send-button"
      >
       Send
      </button>

      {message && (
        <div className="message">
          {message}
        </div>
      )}
    </div>
  );
}

export default Message;