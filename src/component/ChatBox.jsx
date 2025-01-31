import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { getMessages } from "../services/api";
import { useAuth } from "../context/AuthContext";

function ChatBox({ chatId }) {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const { user } = useAuth();
  const userId = user?.id;

  const [isAtBottom, setIsAtBottom] = useState(true); // Track if user is at the bottom

  const {
    data: chatData,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["getChats", chatId],
    queryFn: ({ pageParam = 1 }) =>
      chatId ? getMessages(chatId, pageParam) : [],
    getNextPageParam: (data) =>
      data.currentPage < data.totalPages
        ? Number(data.currentPage) + 1
        : undefined,
    enabled: !!chatId,
  });

  const allChats = chatData?.pages.flatMap((page) => page.data) || [];

  const handleScroll = () => {
    const container = messagesContainerRef.current;

    if (container.scrollTop === 0 && hasNextPage) {
      fetchNextPage();
    }

    if (
      container.scrollHeight - container.scrollTop ===
      container.clientHeight
    ) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
  };

  useEffect(() => {
    if (isAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allChats, isAtBottom]);

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
      onScroll={handleScroll}
    >
      {allChats?.reverse()?.map((message, idx) => (
        <div
          key={idx}
          className={`flex ${
            message.senderId === userId ? "justify-end" : "justify-start"
          }`}
        >
          {message.senderId !== userId && (
            <div className="h-8 w-8 mr-2 rounded-full bg-gray-200 text-gray-800 flex justify-center items-center text-lg font-semibold">
              {message.username?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.senderId === userId
                ? "bg-blue-500 text-white rounded-br-none"
                : "bg-gray-200 text-gray-800 rounded-bl-none"
            }`}
          >
            <p>{message.message}</p>
            <div className="flex items-center">
              {message.senderId === userId && (
                <IoCheckmarkDoneSharp
                  size={20}
                  className={`${
                    message.isSeen ? "text-green-500" : "text-white"
                  } font-bold pt-1`}
                />
              )}
              <span
                className={`text-xs ${
                  message.senderId === userId
                    ? "text-blue-100"
                    : "text-gray-500"
                } mt-1 block`}
              >
                {dayjs(message.timestamp).format("hh:mm:ss DD MMM YYYY")}
              </span>
            </div>
          </div>
          {message.senderId === userId && (
            <div className="h-8 w-8 ml-2 rounded-full bg-blue-500 text-white flex justify-center items-center text-lg font-semibold">
              {message.username?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef}></div>
    </div>
  );
}

export default ChatBox;
