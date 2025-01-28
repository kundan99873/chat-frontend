// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import MessageList from "./component/Messages";
// import ChatBox from "./component/ChatBox";

// const App = () => {
//   const [messages, setMessages] = useState([]);
//   const socket = io("http://localhost:3000");

//   useEffect(() => {
//     socket.on("receiveMessage", (message) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const [name, setName] = useState("");
//   const [modal, setModal] = useState(true);

//   const sendMessage = (message) => {
//     socket.emit("sendMessage", message);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
//       {modal ? (
//         <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
//           <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg">
//             <h2 className="text-2xl font-semibold text-center mb-4">
//               Enter Your Name
//             </h2>
//             <input
//               type="text"
//               className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Type your name"
//             />
//             <button
//               onClick={() => setModal(false)}
//               className="w-full mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             >
//               Start Chat
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="flex flex-col p-4 bg-white shadow-md rounded-t-xl mx-auto max-w-3xl">
//           <MessageList messages={messages} />
//           <ChatBox sendMessage={sendMessage} name={name} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/Login";
import Home from "./pages/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./routes/ProtectedRoute";
import Admin from "./pages/Admin";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      // <ProtectedRoute allowedRole={"admin"}>
        <Admin />
      // {/* </ProtectedRoute> */}
    ),
  },
]);

export default function App() {
  const client = new QueryClient();
  return (
    <div>
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  );
}
