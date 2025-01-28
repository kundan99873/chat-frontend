import React from "react";

const MessageList = ({ messages }) => {
  console.log(messages);
  return (
    <div className="message-list h-96 overflow-auto border border-gray-300">
      {messages.map((msg, index) => (
        <div key={index}>
          <strong className="text-sm pl-2">{msg.user}:</strong> {msg.message}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
