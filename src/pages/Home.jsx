import { useQuery } from "@tanstack/react-query";
import ChatApp from "../component/ChatApp";
import { SocketProvider } from "../context/SocketContext";
import { getLoginUserDetails } from "../services/api";
import { AuthProvider } from "../context/AuthContext";

const Home = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: getLoginUserDetails,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const userId = data?.data.id;

  if (isLoading) return <div>Loading...</div>;

  return (
    <AuthProvider>
      <SocketProvider>
        <ChatApp />
      </SocketProvider>
    </AuthProvider>
  );
};

export default Home;

// import React, { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";
// import {
//   getLoginUserDetails,
//   getMessages,
//   updateSeenMessage,
// } from "../services/api";
// import { useInView } from "react-intersection-observer";
// import {
//   useMutation,
//   useQuery,
//   QueryClient,
//   useInfiniteQuery,
//   useQueryClient,
// } from "@tanstack/react-query";
// import ChatBox from "../component/ChatBox";
// import SideBar from "../component/SideBar";
// import Header from "../component/ChatHeader";
// import MessageInput from "../component/MessageInput";

// const ChatApp = () => {
//   // const [userId, setUserId] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [chatId, setChatId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [selectedUser, setSelectedUser] = useState("");

//   const { ref, inView, entry } = useInView({
//     threshold: 0,
//   });

//   const {
//     data: chatData,
//     isError: chatError,
//     isLoading: chatLoading,
//     fetchNextPage,
//     hasNextPage,
//   } = useInfiniteQuery({
//     queryKey: ["getChats", chatId],
//     queryFn: ({ pageParam }) => {
//       if (chatId) {
//         return getMessages(chatId, pageParam);
//       }
//       return [];
//     },
//     getNextPageParam: (data) => {
//       return data.currentPage < data.totalPages
//         ? Number(data.currentPage) + 1
//         : undefined;
//     },
//     retry: false,
//     enabled: !!chatId,
//   });

//   useEffect(() => {
//     if (inView && hasNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, fetchNextPage, hasNextPage]);

//   const { data, isLoading } = useQuery({
//     queryKey: ["loggedInUser"],
//     queryFn: getLoginUserDetails,
//     retry: false,
//     refetchOnWindowFocus: false,

//   });

//   const seenChat = useMutation({
//     mutationFn: updateSeenMessage,
//     onSuccess: (data) => {
//       console.log(data);

//     },
//     onError: (error) => {
//       console.log(error.message);
//     },
//   });

//   const userId = data?.data.id;

//   useEffect(() => {
//     if (!userId) return;

//     const newSocket = io("http://localhost:3000", {
//       withCredentials: true,
//     });
//     setSocket(newSocket);

//     newSocket.emit("registerUser", { userId });
//     newSocket.on("chatId", (receivedChatId) => setChatId(receivedChatId));

//     return () => {
//       newSocket.close();
//     };
//   }, [userId]);

//   useEffect(() => {
//     if (chatId && userId) {
//       seenChat.mutate({ chatId, userId: selectedUser });
//     }
//   }, [chatId, userId]);

//   useEffect(() => {
//     if (socket && userId && selectedUser) {
//       socket.emit("startChat", { participants: [userId, selectedUser] });
//     }
//   }, [socket, userId, selectedUser]);

//   const queryClient = useQueryClient();

//   const sendMessage = (message) => {
//     if (socket && chatId && message) {
//       socket.emit("newMessage", chatId, userId, message);

//       queryClient.setQueryData(["getChats", chatId], (oldData) => {
//         if (!oldData) return;

//         return {
//           ...oldData,
//           pages: oldData.pages.map((page, index) =>
//             index === 0
//               ? {
//                   ...page,
//                   data: [
//                     {
//                       senderId: userId,
//                       message,
//                       username: data?.data.username,
//                     },
//                     ...page.data,
//                   ],
//                 }
//               : page
//           ),
//         };
//       });
//     }
//   };

//   const allChats = chatData?.pages.flatMap((page) => page.data);
//   console.log({ allChats });

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <SideBar setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
//       <div className="flex-1 flex flex-col">
//         {selectedUser && <Header userId={selectedUser} />}

//         <ChatBox messages={allChats} userId={userId} topRef={ref} />
//         {selectedUser && <MessageInput handleSendMessage={sendMessage} />}
//       </div>
//     </div>
//   );
// };

// export default ChatApp;
// const { data: messageData, isError } = useQuery({
//   queryKey: ["getChats", chatId],
//   queryFn: () => {
//     if (chatId) {
//       return getMessages(chatId, 1);
//     }
//     return [];
//   },
//   enabled: !!chatId,
//   retry: false,
// });

// useEffect(() => {
//   console.log({ messageData });
//   if (isError) {
//     setMessages([]);
//   } else if (messageData) {
//     console.log({ messageData });
//     setMessages(messageData?.data);
//   }
// }, [messageData, isError]);

// import React, { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";
// import {
//   getLoginUserDetails,
//   getMessages,
//   updateSeenMessage,
// } from "../services/api";
// import { useInView } from "react-intersection-observer";
// import {
//   useMutation,
//   useQuery,
//   QueryClient,
//   useInfiniteQuery,
// } from "@tanstack/react-query";
// import ChatBox from "../component/ChatBox";
// import SideBar from "../component/SideBar";
// import Header from "../component/ChatHeader";
// import MessageInput from "../component/MessageInput";

// const ChatApp = () => {
//   const [userId, setUserId] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [chatId, setChatId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [selectedUser, setSelectedUser] = useState("");

//   const {
//     data: chatData,
//     isError: chatError,
//     isLoading: chatLoading,
//   } = useInfiniteQuery({
//     queryKey: ["getChats", chatId],
//     queryFn: ({ pageParam }) => {
//       if (chatId) {
//         return getMessages(chatId, pageParam);
//       }
//       return [];
//     },
//     getNextPageParam: (data) => {
//       return data.currentPage < data.totalPages && data.currentPage + 1;
//     },
//     retry: false,
//     enabled: !!chatId,
//   });

//   console.log({ chatData, chatLoading, chatError });

//   const { ref, inView, entry } = useInView({
//     threshold: 0,
//   });

//   const { data, isLoading } = useQuery({
//     queryKey: ["loggedInUser"],
//     queryFn: getLoginUserDetails,
//     retry: false,
//     refetchOnWindowFocus: false,
//   });

//   const seenChat = useMutation({
//     mutationFn: updateSeenMessage,
//     onSuccess: (data) => {
//       console.log(data);
//     },
//     onError: (error) => {
//       console.log(error.message);
//     },
//   });

//   useEffect(() => {
//     if (data) {
//       setUserId(data?.data.id);
//     }
//   }, [data]);

//   useEffect(() => {
//     if (!userId) return;

//     const newSocket = io("http://localhost:3000", {
//       withCredentials: true,
//     });
//     setSocket(newSocket);

//     newSocket.emit("registerUser", { userId });
//     newSocket.on("chatId", (receivedChatId) => setChatId(receivedChatId));

//     newSocket.on("receiveMessage", ({ senderId, message }) => {
//       setMessages((prev) => [
//         ...prev,
//         { senderId, message, username: data?.data.username },
//       ]);
//     });

//     return () => {
//       newSocket.close();
//     };
//   }, [userId]);

//   useEffect(() => {
//     if (chatId && userId) {
//       seenChat.mutate({ chatId, userId: selectedUser });
//     }
//   }, [chatId, userId]);

//   const { data: messageData, isError } = useQuery({
//     queryKey: ["getChats", chatId],
//     queryFn: () => {
//       if (chatId) {
//         return getMessages(chatId, 1);
//       }
//       return [];
//     },
//     enabled: !!chatId,
//     retry: false,
//   });

//   useEffect(() => {
//     console.log({ messageData });
//     if (isError) {
//       setMessages([]);
//     } else if (messageData) {
//       console.log({ messageData });
//       setMessages(messageData?.data);
//     }
//   }, [messageData, isError]);

//   console.log({ messages });

//   useEffect(() => {
//     console.log("hello");
//     if (socket && userId && selectedUser) {
//       socket.emit("startChat", { participants: [userId, selectedUser] });
//     }
//   }, [socket, userId, selectedUser]);

//   const sendMessage = (message) => {
//     if (socket && chatId && message) {
//       socket.emit("sendMessage", chatId, userId, message);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <SideBar setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
//       <div className="flex-1 flex flex-col">
//         <div ref={ref}></div>
//         {selectedUser && <Header userId={selectedUser} />}
//         <ChatBox messages={messages} userId={userId} />
//         {selectedUser && <MessageInput handleSendMessage={sendMessage} />}
//       </div>
//     </div>
//   );
// };

// export default ChatApp;
