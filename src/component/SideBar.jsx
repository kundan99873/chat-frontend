// import { useMutation, useQuery } from "@tanstack/react-query";
// import React, { useState } from "react";
// import { FiUser } from "react-icons/fi";
// import { getAvailableUsers, logoutUser } from "../services/api";
// import { capitalizeFirstLetter } from "../utils/utils";
// import { MdLogout } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// export default function SideBar({ selectedUser, setSelectedUser }) {
//   const { data, isFetching } = useQuery({
//     queryKey: "users",
//     queryFn: getAvailableUsers,
//   });
//   const navigate = useNavigate();

//   const logout = useMutation({
//     mutationFn: logoutUser,
//     onSuccess: (data) => {
//       console.log(data);
//       if (data.success) {
//         toast.success("Logout Successfull!!!");
//         navigate("/login");
//       }

//       console.log(data);
//     },
//     onError: (error) => {
//       setErrorMessage(error.message);
//     },
//   });

//   if (isFetching) {
//     return <p>Loading...</p>;
//   }

//   const handleLogout = () => {
//     logout.mutate();
//     console.log("Logout");
//   };

//   return (
//     <div className="w-1/5 bg-white shadow-md border-r h-screen border-gray-200 flex flex-col">
//       <div className="flex items-center  px-4 bg-gray-300 gap-3 h-14">
//         <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full">
//           <FiUser className="text-xl" />
//         </div>
//         <h2 className="text-lg font-semibold">Chats</h2>
//       </div>
//       <ul className="no-scrollbar max-h-[92vh]">
//         {data?.data.map((user, index) => (
//           <li
//             key={index}
//             className={`flex items-center gap-3 px-4 py-2 border-b border-gray-600 cursor-pointer hover:bg-gray-200 ${
//               selectedUser == user._id ? "bg-gray-200" : "bg-gray-50"
//             }`}
//             onClick={() => setSelectedUser(user._id)}
//           >
//             <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full">
//               <FiUser className="text-lg" />
//             </div>
//             <div className="flex-1">
//               <p className="text-sm font-semibold text-gray-800">
//                 {capitalizeFirstLetter(user.username)}
//               </p>
//               <p className="text-xs text-gray-500 truncate">
//                 {user.lastMessage}
//               </p>
//             </div>
//             <span className="text-xs text-gray-400">{user.time}</span>
//           </li>
//         ))}
//       </ul>

//       <div className="py-4 px-4 mt-auto font-medium text-lg">
//         <button
//           className="w-full text-center py-2 bg-red-500 text-white rounded-md cursor-pointer flex justify-center gap-2 items-center"
//           onClick={handleLogout}
//         >
//           <MdLogout className="text-2xl font-semibold" />
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Search, Settings, LogOut } from "lucide-react";
import {
  getAvailableUsers,
  getLoginUserDetails,
  logoutUser,
} from "../services/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { capitalizeFirstLetter } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Sidebar({ selectedUser, setSelectedUser }) {
  const navigate = useNavigate();
  const { data, isFetching } = useQuery({
    queryKey: "users",
    queryFn: getAvailableUsers,
  });

  const [search, setSearch] = useState("");

  const { data: user } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: () => getLoginUserDetails(),
    retry: false,
  });

  console.log({ user });

  const logout = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      console.log(data);
      if (data.success) {
        toast.success("Logout Successfull!!!");
        navigate("/login");
      }

      console.log(data);
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  if (isFetching) {
    return <p>Loading...</p>;
  }

  const handleLogout = () => {
    logout.mutate();
    navigate("/login");
    toast.success("Logged out successfully!!!");
    console.log("Logout");
  };
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* User Profile */}
      <div className="p-3 px-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9385/9385289.png"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="font-semibold">
                {capitalizeFirstLetter(user?.data.username)}
              </h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <button className="p-2 hover:bg-gray-100 rounded-full">
              <Settings size={20} className="text-gray-600" />
            </button> */}
            <button
              className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={20} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search messages"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent ml-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {data?.data.map((contact) => (
          <div
            key={contact.id}
            onClick={() => setSelectedUser(contact.userId)}
            className={`p-4 cursor-pointer hover:bg-gray-100 ${
              selectedUser === contact.userId ? "bg-blue-100" : ""
            }`}
          >
            <div
              className="flex items-center gap-3"
              // onClick={() => setSelectedUser(contact.userId)}
            >
              <img
                src={"https://cdn-icons-png.flaticon.com/512/9385/9385289.png"}
                alt={contact.name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">
                    {capitalizeFirstLetter(contact.username)}
                  </h3>
                  <span className="text-sm text-gray-500 flex-shrink-0">
                    {contact.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {contact.lastMessage}
                </p>
              </div>
              {contact.unreadMessagesCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {contact.unreadMessagesCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
