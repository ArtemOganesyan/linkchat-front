import React from 'react';
import './Message.css';

const formatTime = (time) => {
    const date = new Date(time);
    // Format as HH:mm (24-hour, zero-padded)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

function SentMessage({ message, timestamp }) {
    return (
        <div
            className="message sent-message"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end'
            }}
        >
            <span className="message-text">
                {message}
            </span>
            <span className="message-timestamp">
                {formatTime(timestamp)}
            </span>
        </div>
    );
}

function ReceivedMessage({ message, timestamp }) {
    return (
        <div
            className="message received-message"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
            }}
        >
            <span className="message-text">
                {message}
            </span>
            <span className="message-timestamp">
                {formatTime(timestamp)}
            </span>
        </div>
    );
}

function Message({ message, isUser, timestamp }) {
    return isUser ? (
        <SentMessage message={message} timestamp={timestamp} />
    ) : (
        <ReceivedMessage message={message} timestamp={timestamp} />
    );
}

export default Message;