import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import ChatBox from "../component/ChatBox";
import SideBar from "../component/SideBar";
import Header from "../component/ChatHeader";
import MessageInput from "../component/MessageInput";
import { useAuth } from "../context/AuthContext";

const ChatApp = () => {
  const socket = useSocket(); // Get socket from context
  const [chatId, setChatId] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");

  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (socket && userId) {
      socket.on("chatId", (receivedChatId) => setChatId(receivedChatId));
      return () => {
        socket.off("chatId");
      };
    }
  }, [socket, userId]);

  useEffect(() => {
    if (socket && userId && selectedUser) {
      socket.emit("startChat", { participants: [userId, selectedUser] });
    }
  }, [socket, userId, selectedUser]);

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
      <div className="flex-1 flex flex-col">
        {selectedUser && <Header userId={selectedUser} />}
        <ChatBox chatId={chatId} />
        {selectedUser && <MessageInput chatId={chatId} />}
      </div>
    </div>
  );
};

export default ChatApp;
