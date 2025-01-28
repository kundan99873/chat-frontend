import React, { useState } from "react";
import { Send } from "lucide-react";

function MessageInput({ handleSendMessage }) {
  const [messageInput, setMessageInput] = useState("");

  const handleSend = () => {
    if (messageInput.trim()) {
      handleSendMessage(messageInput);
      setMessageInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };
  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={handleKeyDown}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
