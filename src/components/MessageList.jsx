import React, { useEffect, useRef } from 'react';
import NoContentPlaceholder from './NoContentPlaceholder';
import './MessageList.css';
import MessageImage from './MessageImage';

const MessageList = ({ messages, roomId }) => {
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
        messages.map((msg, index) => {
          const isMe = (msg?.sender === 'me') || !!msg?.isUser;
          const text = msg?.messageText ?? msg?.text ?? '';

          if (!text?.trim() && !msg?.attachment) return null;

          return (
            <div
              key={msg?.id ?? index}
              className={`message-bubble ${isMe ? 'sent-message' : 'received-message'}`}
            >
              {text}
              <MessageImage msg={msg} roomId={roomId} />
              {msg?.attachment && (
                <div className="message-attachment">
                  📎 {msg.attachment.name}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default MessageList;
