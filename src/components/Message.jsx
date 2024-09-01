import React from 'react';

function Message({ message, showSender, currentUser }) {
  const isOutgoing = message.sender === currentUser;

  return (
    <div className={`message ${isOutgoing ? 'outgoing' : 'incoming'}`}>
      {showSender && (
        <div className="message-sender">
          {message.sender}
        </div>
      )}
      <div className="message-content">{message.content}</div>
      <div className="message-timestamp">{message.timestamp}</div>
    </div>
  );
}

export default Message;
