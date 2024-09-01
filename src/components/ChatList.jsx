import React, { useState } from 'react';

function ChatList({ chats, onSelectChat, selectedChat }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chat-list-container">
      <input 
        type="text" 
        className="search-bar" 
        placeholder="Search chats..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="chat-list">
        {filteredChats.map((chat) => (
          <li
            key={chat.id}
            className={`chat-item ${selectedChat && selectedChat.id === chat.id ? 'selected' : ''}`}
            onClick={() => onSelectChat(chat)}
          >
            <div className="chat-item-name">{chat.name}</div>
            <div className="chat-item-preview">{chat.preview}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatList;
