import React, { useEffect, useRef } from 'react';
import './MessageList.css';
import Message from './Message';

const MessageList = ({ messages }) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]); 

  return (
    <div ref={listRef} className="message-list">
      {Array.isArray(messages) &&
        messages.map((msg, index) => (
          <Message key={index} {...msg} />
        ))}
    </div>
  );
};

export default MessageList;
