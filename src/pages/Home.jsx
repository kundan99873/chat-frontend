import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import {
  getLoginUserDetails,
  getMessages,
  updateSeenMessage,
} from "../services/api";
import { useMutation, useQuery, QueryClient } from "@tanstack/react-query";
import ChatBox from "../component/ChatBox";
import SideBar from "../component/SideBar";
import Header from "../component/ChatHeader";
import MessageInput from "../component/MessageInput";

const ChatApp = () => {
  const [userId, setUserId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: getLoginUserDetails,
    retry: false,
  });

  const seenChat = useMutation({
    mutationFn: updateSeenMessage,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  useEffect(() => {
    if (data) {
      setUserId(data?.data.id);
    }
  }, [data]);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io("http://192.168.1.113:3000", {
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.emit("registerUser", { userId });
    newSocket.on("chatId", (receivedChatId) => setChatId(receivedChatId));

    newSocket.on("receiveMessage", ({ senderId, message }) => {
      setMessages((prev) => [
        ...prev,
        { senderId, message, username: data?.data.username },
      ]);
    });

    return () => {
      newSocket.close();
    };
  }, [userId]);

  useEffect(() => {
    if (chatId) {
      seenChat.mutate({ chatId });
    }
  }, [chatId]);

  const { data: messageData, isError } = useQuery({
    queryKey: ["getChats", chatId],
    queryFn: () => {
      if (chatId) {
        return getMessages(chatId);
      }
      return [];
    },
    enabled: !!chatId,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      setMessages([]);
    } else if (messageData) {
      setMessages(messageData?.data);
    }
  }, [messageData, isError]);

  console.log({ messages });

  useEffect(() => {
    console.log("hello");
    if (socket && userId && selectedUser) {
      socket.emit("startChat", { participants: [userId, selectedUser] });
    }
  }, [socket, userId, selectedUser]);

  const sendMessage = (message) => {
    if (socket && chatId && message) {
      socket.emit("sendMessage", chatId, userId, message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
      <div className="flex-1 flex flex-col">
        {selectedUser && <Header userId={selectedUser} />}
        <ChatBox messages={messages} userId={userId} />
        {selectedUser && <MessageInput handleSendMessage={sendMessage} />}
      </div>
    </div>
  );
};

export default ChatApp;

// <div className="flex h-screen">
//   <SideBar setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
//   <ChatBox
//     userId={userId}
//     messages={messages}
//     sendMessage={sendMessage}
//     selectedUser={selectedUser}
//   />
// </div>
