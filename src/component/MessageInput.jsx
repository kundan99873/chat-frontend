import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLoginUserDetails } from "../services/api";
import { useAuth } from "../context/AuthContext";

function MessageInput({ chatId }) {
  const [messageInput, setMessageInput] = useState("");
  const queryClient = useQueryClient();

  const socket = useSocket();
  const { user } = useAuth();
  const userId = user?.id;

  const sendMessage = (message) => {
    if (socket && chatId && message) {
      socket.emit("newMessage", chatId, userId, message);
    }
  };

  useEffect(() => {
    if (socket && chatId) {
      socket.on("newMessage", ({ senderId, message }) => {
        queryClient.setQueryData(["getChats", chatId], (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            pages: oldData.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    data: [
                      {
                        senderId,
                        message,
                        username: user?.username,
                      },
                      ...page.data,
                    ],
                  }
                : page
            ),
          };
        });
      });
    }
    return () => {
      socket.off("newMessage");
    };
  }, [chatId]);

  const handleSend = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
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
