import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import ChatBox from "../component/ChatBox";
import SideBar from "../component/SideBar";
import Header from "../component/ChatHeader";
import MessageInput from "../component/MessageInput";
import { useAuth } from "../context/AuthContext";
import VideoCall from "./VideoCall";
import { X } from "lucide-react";

const ChatApp = () => {
  const socket = useSocket(); // Get socket from context
  const [chatId, setChatId] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");

  const [video, setVideo] = useState(false);

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
        {selectedUser && <Header userId={selectedUser} setVideo={setVideo} />}
        <ChatBox chatId={chatId} />
        {/* {selectedUser && <VideoCall peerId={selectedUser} />} */}
        {selectedUser && <MessageInput chatId={chatId} />}
      </div>
      {video && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <div className="bg-white w-[700px] h-[500px] rounded-xl ">
            <div className="flex justify-between p-3">
              <p className="text-lg font-medium">Start Video Calls</p>
              <X className="cursor-pointer" onClick={() => setVideo(false)} />
            </div>
            <VideoCall peerId={selectedUser} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
