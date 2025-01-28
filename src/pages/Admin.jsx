import React, { useState } from 'react';
import { MessageSquare, Send, Phone, Video, MoreVertical, Search, Users, Settings, LogOut } from 'lucide-react';

function App() {
  const [currentChat, setCurrentChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');

  const contacts = [
    {
      id: 1,
      name: "Sarah Wilson",
      lastMessage: "Sure, let's meet tomorrow!",
      time: "10:30 AM",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      unread: 2
    },
    {
      id: 2,
      name: "John Cooper",
      lastMessage: "The project looks great!",
      time: "9:15 AM",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    },
    {
      id: 3,
      name: "Emily Brown",
      lastMessage: "Thanks for your help!",
      time: "Yesterday",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
    }
  ];

  const messages = [
    { id: 1, content: "Hey, how are you?", sender: "other", timestamp: "10:00 AM" },
    { id: 2, content: "I'm good, thanks! How about you?", sender: "user", timestamp: "10:02 AM" },
    { id: 3, content: "Great! Would you like to meet tomorrow to discuss the project?", sender: "other", timestamp: "10:05 AM" },
    { id: 4, content: "Sure, let's meet tomorrow!", sender: "user", timestamp: "10:30 AM" },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      setMessageInput('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-semibold">Alex Morgan</h2>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Settings size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <LogOut size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setCurrentChat(contact.id)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                currentChat === contact.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{contact.name}</h3>
                    <span className="text-sm text-gray-500">{contact.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {contact.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={contacts.find(c => c.id === currentChat)?.avatar}
                alt="Chat Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-semibold">{contacts.find(c => c.id === currentChat)?.name}</h2>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Phone size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Video size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p>{message.content}</p>
                <span className={`text-xs ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'} mt-1 block`}>
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;