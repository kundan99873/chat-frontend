// import React, { createContext, useContext, useEffect, useState } from "react";
// import io from "socket.io-client";

// const SocketContext = createContext(null);

// export const SocketProvider = ({ userId, children }) => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     if (!userId) return;

//     const newSocket = io("http://localhost:3000", { withCredentials: true });
//     setSocket(newSocket);

//     newSocket.emit("registerUser", { userId });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, [userId]);

//   return (
//     <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
//   );
// };

// export const useSocket = () => {
//   return useContext(SocketContext);
// };

import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log({ user });
    if (!user?.id) return;

    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.emit("registerUser", { userId: user.id });

    return () => {
      newSocket.close();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
