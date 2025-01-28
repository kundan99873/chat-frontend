import React from "react";
import { Phone, Video, MoreVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { capitalizeFirstLetter, getTimeDifference } from "../utils/utils";
import { getUserDetailsById } from "../services/api";

function Header({ userId }) {
  console.log({ userId });
  const { data, isLoading } = useQuery({
    queryKey: ["getUserDetails", userId],
    queryFn: () => getUserDetailsById(userId),
    retry: false,
    enabled: !!userId,
  });
  console.log(data);
  return (
    <div className="p-3 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={"https://cdn-icons-png.flaticon.com/512/9385/9385289.png"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold">
              {capitalizeFirstLetter(data?.data.username)}
            </h2>
            {data?.data.isActive ? (
              <p className="text-sm text-gray-500">Online</p>
            ) : (
              <p className="text-sm text-gray-500">
                last seen {getTimeDifference(data?.data.lastActive)}
              </p>
            )}
          </div>
        </div>
        {/* <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Phone size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Video size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical size={20} className="text-gray-600" />
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default Header;
