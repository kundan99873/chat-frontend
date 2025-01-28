import dayjs from "dayjs";
import React, { useEffect, useRef } from "react";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

function ChatBox({ userId, messages }) {
  console.log({ userId, messages });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
      {messages.map((message, idx) => (
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
            <div className="flex items-center ">
              {console.log(message.isSeen)}
              {message.senderId == userId && (
                <IoCheckmarkDoneSharp
                  size={20}
                  className={` ${
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
          {message.senderId == userId && (
            <div className="h-8 w-8 ml-2 rounded-full bg-blue-500 text-white flex justify-center items-center text-lg font-semibold">
              {message.username?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </div>
      ))}

      <div ref={messagesEndRef}></div>

      {/* <div className="flex justify-center items-center h-full flex-col">
          <p>No Chat Found</p>
          <p>Start Chat Now</p>
        </div> */}
    </div>
  );
}

export default ChatBox;
