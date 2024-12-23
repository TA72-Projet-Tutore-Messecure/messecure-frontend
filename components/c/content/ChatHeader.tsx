// components/c/content/ChatHeader.tsx

"use client";

import React, { useEffect, useState } from "react";
import { Avatar, Spinner } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { RoomMember } from "matrix-js-sdk";

import { useMatrix } from "@/context/MatrixContext";
import { DotDropdown } from "@/components/c/content/header/DotDropdown";
import MatrixService from "@/services/MatrixService";

export const ChatHeader: React.FC = () => {
  const { selectedRoom } = useMatrix();

  // Initialize hooks unconditionally
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedRoom) {
      // If there's no selectedRoom, reset avatar and loading states
      setAvatarUrl(null);
      setIsLoading(false);

      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const members = selectedRoom.getJoinedMembers();

    const fetchAvatar = async () => {
      if (members.length === 2) {
        const client = MatrixService.getClient();
        const myUserId = client.getUserId();
        const otherMember: RoomMember =
          members[0].userId !== myUserId ? members[0] : members[1];

        setIsLoading(true);
        try {
          const blobUrl = await MatrixService.getUserAvatarThumbnail(
            otherMember,
            {
              signal: controller.signal,
            },
          );

          if (isMounted) {
            setAvatarUrl(blobUrl);
          }
        } catch (error) {
          if (isMounted) {
            setAvatarUrl(null);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else {
        setAvatarUrl(null); // For group rooms or if no avatar
      }
    };

    fetchAvatar();

    return () => {
      isMounted = false;
      controller.abort();
      // Revoke Blob URL to free memory
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [selectedRoom]);

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

  return (
    <div className="bg-white dark:bg-[#212121] w-full flex justify-between h-[10vh] z-50 shadow items-center">
      <div className="flex flex-row items-center gap-3 ml-[2vw]">
        <div>
          {isLoading ? (
            <Spinner size="sm" />
          ) : avatarUrl ? (
            <Avatar
              isBordered
              alt="User Avatar"
              className="cursor-pointer"
              color="primary"
              size="md"
              src={avatarUrl}
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
