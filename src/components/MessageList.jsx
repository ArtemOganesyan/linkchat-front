import React from 'react';
import Message from './Message';
import './MessageList.css';

const MessageList = () => {
  const messages = [
    { id: 1, text: 'Message 1', isUser: false },
    { id: 2, text: 'Message 2', isUser: true },
    { id: 3, text: 'Message 3', isUser: false },
    { id: 4, text: 'Message 4', isUser: true },
    { id: 5, text: 'Message 5', isUser: false },
    { id: 6, text: 'Message 6', isUser: true },
    { id: 7, text: 'Message 7', isUser: false },
    { id: 8, text: 'Message 8', isUser: true },
    { id: 9, text: 'Message 9', isUser: false },
    { id: 10, text: 'Message 10', isUser: true },
  ];

  return (
    <div className="message-list">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg.text} isUser={msg.isUser} />
      ))}
    </div>
  );
};

export default MessageList;
