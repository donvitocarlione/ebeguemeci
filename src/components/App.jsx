import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import ChatList from './ChatList';
import ChatViewer from './ChatViewer';
import { processFolder } from '../utils/fileProcessor';
import { identifyUser } from '../utils/chatParser';

function App() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState('');

  const handleFileUpload = async (filesOrHandles) => {
    try {
      setError(null);
      const processedChats = await processFolder(filesOrHandles);
      const chatsWithIds = processedChats.map((chat, index) => {
        const chatId = chat.messages[0]?.sender || `Chat ${index + 1}`;
        const lastMessage = chat.messages[chat.messages.length - 1];
        return {
          ...chat,
          id: index + 1,
          chatId: chatId,
          preview: lastMessage ? `${lastMessage.content.substring(0, 30)}...` : 'No messages',
          lastMessageTime: lastMessage ? lastMessage.timestamp : null
        };
      });
      setChats(chatsWithIds);

      if (chatsWithIds.length > 0) {
        const user = identifyUser(chatsWithIds[0].messages);
        setCurrentUser(user);
      }
    } catch (err) {
      console.error('Error processing files:', err);
      setError('An error occurred while processing the files. Please try again.');
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="App">
      <h1>WhatsApp Chat Analyzer</h1>
      {chats.length === 0 ? (
        <>
          <FileUpload onFileUpload={handleFileUpload} />
          {error && <p className="error-message">{error}</p>}
        </>
      ) : (
        <div className="chat-container">
          <ChatList 
            chats={chats} 
            onSelectChat={handleChatSelect} 
            selectedChat={selectedChat} 
          />
          {selectedChat ? (
            <ChatViewer chat={selectedChat} currentUser={currentUser} />
          ) : (
            <div className="no-chat-selected">
              <p>Select a chat to view messages</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
