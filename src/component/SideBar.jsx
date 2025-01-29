import React, { useState, useEffect } from "react";
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
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: "allUsers",
    queryFn: () => getAvailableUsers({ search: debouncedSearch }),
  });

  const { data: user } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: () => getLoginUserDetails(),
    retry: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  console.log({ user });

  const logout = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      console.log(data);
      if (data.success) {
        toast.success("Logout Successfull!!!");
        navigate("/login");
      }
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

  // Debounce the search term

  // Filter contacts based on the debounced search term
  const filteredContacts = data?.data.filter((contact) =>
    contact.username.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

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
            onChange={(e) => setSearch(e.target.value)} // Update search state immediately
            className="w-full bg-transparent ml-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts?.map((contact) => (
          <div
            key={contact.id}
            onClick={() => setSelectedUser(contact.userId)}
            className={`p-4 cursor-pointer hover:bg-gray-100 ${
              selectedUser === contact.userId ? "bg-blue-100" : ""
            }`}
          >
            <div className="flex items-center gap-3">
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
