import React, { useEffect, useRef } from 'react';
import NoContentPlaceholder from './NoContentPlaceholder'; 
import './MessageList.css';

const MessageList = ({ messages }) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]); 

  return (
    
     <div ref={listRef} className="message-list">
      {(!Array.isArray(messages) || messages.length === 0) ? (
        <NoContentPlaceholder message="No messages yet." />
      ) : (
        
        messages.map((msg) => (
          <div
            key={msg.messageId}
            style={{
              alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'You' ? '#dcf8c6' : '#f1f0f0',
              padding: '10px 14px',
              borderRadius: '12px',
              maxWidth: '70%',
              wordBreak: 'break-word',
              boxShadow: '0 1px 2px rgba(39, 153, 28, 0.1)',
              marginBottom: '8px'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{msg.sender}</div>
            <div>{msg.messageText}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                 {msg.timestamp
                 ? (!isNaN(Date.parse(msg.timestamp))
                 ? new Date(msg.timestamp).toLocaleString()
                 : msg.timestamp)
             : ''}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
