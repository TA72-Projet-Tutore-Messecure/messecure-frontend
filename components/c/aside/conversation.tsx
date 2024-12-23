// components/c/aside/conversation.tsx

"use client";

import { Avatar } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Room, RoomMember } from "matrix-js-sdk";
import { FaCheck, FaTrash } from "react-icons/fa"; // Ensure you have these icons

import MatrixService from "@/services/MatrixService";

interface CAsideConversationProps {
  room: Room;
  active: boolean;
  onClick: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
}

export const CAsideConversation: React.FC<CAsideConversationProps> = ({
  room,
  active,
  onClick,
  onAccept,
  onDecline,
}) => {
  const roomName = room.name || room.roomId;
  const lastEvent = room.timeline[room.timeline.length - 1];
  const lastMessage = lastEvent?.getContent()?.body || "";
  const lastTimestamp = lastEvent?.getDate()?.toLocaleTimeString() || "";
  const membership = room.getMyMembership();
  const members = room.getJoinedMembers();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAvatar = async () => {
      if (members.length === 2) {
        const client = MatrixService.getClient();
        const myUserId = client.getUserId();
        const otherMember: RoomMember =
          members[0].userId !== myUserId ? members[0] : members[1];

        const blobUrl = await MatrixService.getUserAvatarThumbnail(otherMember);

        if (isMounted) {
          setAvatarUrl(blobUrl);
        }
      } else {
        setAvatarUrl(null); // For group rooms or if no avatar
      }
    };

    fetchAvatar();

    return () => {
      isMounted = false;
      // Revoke Blob URL to free memory
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [room, members]);

  return (
    <div
      className={`w-full max-w-sm py-2 px-3 flex flex-row gap-3 items-center rounded-xl cursor-pointer flex-shrink-0
                       ${
                         active
                           ? "bg-[#3390ec] dark:bg-[#8472dc]"
                           : "hover:bg-[#f4f4f5] dark:hover:bg-[#2c2c2c]"
                       }`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div>
        {avatarUrl ? (
          <Avatar
            alt="User Avatar"
            className="w-14 h-14 min-w-14 min-h-14 rounded-full"
            src={avatarUrl}
          />
        ) : (
          <Avatar
            className="w-14 h-14 min-w-14 min-h-14 text-small"
            name={roomName}
          />
        )}
      </div>
      <div className="flex flex-col justify-between items-start w-full max-w-[17vw]">
        <div className="w-full flex flex-row items-center justify-between">
          <span
            className={`text-sm font-bold truncate ${
              active ? "text-white" : "dark:text-white"
            }`}
          >
            {roomName}
          </span>
          <span
            className={`text-xs ${
              active ? "text-white" : "dark:text-white/30"
            }`}
          >
            {lastTimestamp}
          </span>
        </div>
        <span
          className={`truncate w-full overflow-hidden text-ellipsis ${
            active ? "text-white" : "text-default-500 dark:text-default-500"
          }`}
        >
          {lastMessage}
        </span>
      </div>
      {membership === "invite" && (
        <div className="flex items-center space-x-2">
          <button
            className="text-green-500 hover:text-green-700"
            onClick={(e) => {
              e.stopPropagation();
              if (onAccept) onAccept();
            }}
          >
            <FaCheck className="w-5 h-5" />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              if (onDecline) onDecline();
            }}
          >
            <FaTrash className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
