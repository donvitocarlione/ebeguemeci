import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import { searchMessages } from '../utils/chatParser';

function ChatViewer({ chat, currentUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    setFilteredMessages(chat.messages);
  }, [chat]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [filteredMessages]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      setFilteredMessages(searchMessages(chat, term));
    } else {
      setFilteredMessages(chat.messages);
    }
  };

  return (
    <div className="chat-viewer">
      <div className="chat-header">
        <h2>{chat.chatId}</h2>
        <span className="message-count">{chat.messages.length} messages</span>
      </div>
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search messages"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="messages-container" ref={messagesContainerRef}>
        {filteredMessages.map((message, index) => (
          <Message 
            key={index} 
            message={message} 
            showSender={index === 0 || filteredMessages[index - 1].sender !== message.sender}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
}

export default ChatViewer;
