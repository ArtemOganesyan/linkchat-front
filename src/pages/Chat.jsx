import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import Participants from '../components/Participants';
import Controls from '../components/Controls';
import MessageList from '../components/MessageList';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [chatTitle, setChatTitle] = useState('');
  const { roomId, chatId } = useParams();

  useEffect(() => {
    if (roomId) {
      console.log(`Joining chat room: ${roomId}${chatId ? `, chat: ${chatId}` : ''}`);

      const fetchMessages = async () => {
        try {
          // Use relative URL so dev proxy can handle CORS/cookies
          const response = await fetch(`/api/chat/${roomId}`);
          if (response.ok) {
            const chatData = await response.json();
            console.log('Fetched chat data:', chatData);

            setChatTitle(chatData.title || '');
            setParticipants(chatData.users || []);

            const formattedMessages = (chatData.messages || []).map((msg) => ({
              id: msg.messageId,
              messageId: msg.messageId,
              text: msg.messageText,
              sender: msg.sender,
              timestamp: msg.timestamp ? new Date(msg.timestamp) : null,
              messageType: msg.messageType,
              imageData: msg.imageData,
              imageFilename: msg.imageFilename,
              imageContentType: msg.imageContentType,
              recipient: msg.recipient,
            }));

            setMessages(formattedMessages);
          } else {
            console.error('Failed to fetch messages:', response.status, response.statusText);
            setMessages([]);
            setParticipants([]);
            setChatTitle('');
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
          setMessages([]);
          setParticipants([]);
          setChatTitle('');
        }
      };

      fetchMessages();
    } else {
      setMessages([]);
      setParticipants([]);
      setChatTitle('');
    }
  }, [roomId, chatId]);

  const handleSend = (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div>
      {roomId && (
        <div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px' }}>
          <strong>
            {chatTitle || `Chat Room: ${roomId}`}
            {chatId ? ` - Chat: ${chatId}` : ''}
          </strong>
        </div>
      )}
      <ChatWindow
        messages={messages}
        leftContent={<Participants participants={participants} />}
        topRightContent={<MessageList messages={messages} roomId={roomId} />}
        bottomRightContent={<Controls onSend={handleSend} />}
      />
    </div>
  );
};

export default Chat;