// components/c/content/ChatHeader.tsx

"use client";

import React from "react";
import { Avatar } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";

import { useMatrix } from "@/context/MatrixContext";
import { DotDropdown } from "@/components/c/content/header/DotDropdown";
import MatrixService from "@/services/MatrixService";

export const ChatHeader: React.FC = () => {
  const { selectedRoom } = useMatrix();

  if (!selectedRoom) {
    return null;
  }

  const roomName = selectedRoom.name || selectedRoom.roomId;

  // Use the isDirectRoom and isDMRoomInvitedMember methods from MatrixService
  const isDirectRoom = MatrixService.isDirectRoom(selectedRoom.roomId);
  const isDM = MatrixService.isDMRoomInvitedMember(selectedRoom);
  const direct = isDirectRoom || isDM;

  // If it's not a direct room, it's a group room
  const isGroupRoom = !direct;

  const displayRoomName = isGroupRoom ? `${roomName} (group)` : roomName;

  const members = selectedRoom.getMembers();

  let avatarUrl = null;
  if (members.length == 2) {
    if (members[0].userId != MatrixService.getClient().getUserId()) {
      avatarUrl = members[0].getAvatarUrl(MatrixService.getClient().getHomeserverUrl(), 100, 100, "scale", false, false);
    } else {
      avatarUrl = members[1].getAvatarUrl(MatrixService.getClient().getHomeserverUrl(), 100, 100, "scale", false, false);
    }
  }

  return (
    <div className="bg-white dark:bg-[#212121] w-full flex justify-between h-[10vh] z-50 shadow items-center">
      <div className="flex flex-row items-center gap-3 ml-[2vw]">
        <div>
          {avatarUrl ? (
            <Avatar
              src={avatarUrl}
              isBordered
              className="cursor-pointer"
              color="primary"
              alt="User Avatar"
              size="md"
            />
          ) : (
            <Avatar
              isBordered
              className="cursor-pointer"
              color="primary"
              name={roomName}
              size="md"
            />
          )}
        </div>
        <h3 className="cursor-pointer text-black dark:text-white text-lg">
          {displayRoomName}
        </h3>
      </div>
      <div className="flex flex-row items-center gap-4 mr-[2vw]">
        <FaSearch className="w-5 h-5 cursor-pointer" />
        <DotDropdown isGroupRoom={isGroupRoom} />
      </div>
    </div>
  );
};

export default ChatHeader;
