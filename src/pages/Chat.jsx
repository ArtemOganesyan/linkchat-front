import React, { useState, useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import Participants from '../components/Participants';
import Controls from '../components/Controls';
import MessageList from '../components/MessageList';


const Chat = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/chat/messages')
      .then(res => res.json())
      .then(data => setMessages(data.messages)); 
  }, []);


  const handleSend = async (newMessage) => {
  try {
    const response = await fetch('http://localhost:8080/api/chat/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: newMessage.isUser ? 'You' : 'Other',
        content: newMessage.text,
      }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    const savedMessage = await response.json();

  
      setMessages((prev) => [
        ...prev,
        {
          messageId: savedMessage.messageId || Date.now(), 
          messageText: savedMessage.messageText, 
          timestamp: savedMessage.timestamp,
          sender: savedMessage.sender,
          recipient: savedMessage.recipient || '',
        },
      ]);
    } catch (error) {
      alert('Message not sent: ' + error.message);
    }
  };
  return (
    <ChatWindow
      messages={messages}
      leftContent={<Participants />}
      topRightContent={<MessageList messages={messages} />}
      bottomRightContent={<Controls onSend={handleSend} />}
    />
  );
};

export default Chat;
