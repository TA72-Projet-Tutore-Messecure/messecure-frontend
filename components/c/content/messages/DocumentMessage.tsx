// components/c/content/messages/DocumentMessage.tsx

"use client";

import React, { useState } from "react";
import { CheckIcon } from "@nextui-org/shared-icons";
import { CheckCheckIcon, Clock } from "lucide-react";
import { FaFile, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";

import {
  DocumentMessageProps,
  MessageStatus,
  MessageTarget
} from "@/types/messages";
import MatrixService from "@/services/MatrixService";
import { useMatrix } from "@/context/MatrixContext";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";

export const DocumentMessage: React.FC<DocumentMessageProps> = ({
                                                                  eventId,
                                                                  isRedacted,
                                                                  time,
                                                                  target,
                                                                  status,
                                                                  documentName,
                                                                  documentSize,
                                                                  documentLink
                                                                }) => {
  const { deleteMessage } = useMatrix();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setIsPopoverOpen(false);
  };

  const handleDeleteMessage = () => {
    if (eventId) {
      deleteMessage(eventId);
      toast.error("Message deleted.");
    }
    handleClosePopover();
  };

  const actions = [];

  if (target === MessageTarget.SENDER && !isRedacted) {
    actions.push(
      <DropdownItem
        key="deleteMessage"
        color="danger"
        onClick={handleDeleteMessage}
      >
        <span className="flex flex-row gap-2 items-center">
          <FaTrash /> Delete Message
        </span>
      </DropdownItem>
    );
  }

  if (actions.length === 0) {
    actions.push(
      <DropdownItem key="noAction" isReadOnly>
        No actions available.
      </DropdownItem>
    );
  }

  // Function to handle document click and download
  const handleDocumentClick = async () => {
    try {
      const blob = await MatrixService.fetchMediaAsBlob(documentLink);

      // Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger download
      const a = document.createElement("a");

      a.href = url;
      a.download = documentName;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      // console.error("Download failed:", error);
      toast.error("Failed to download the document.");
    }
  };

  // If the message is redacted, display a placeholder
  if (isRedacted) {
    return (
      <div
        className={`w-full px-32 flex flex-row ${
          target === MessageTarget.SENDER ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`relative base-message ${
            target === MessageTarget.SENDER
              ? "message-sender text-black bg-[#eeffde] dark:text-white dark:!bg-[#766ac8] rounded-l-xl rounded-t-xl"
              : "bg-white dark:bg-[#212121] rounded-xl"
          } flex flex-col gap-1 max-w-[33%] py-3 px-3`}
        >
          <div className="message-deleted text-gray-500 dark:text-gray-400">
            Message deleted
          </div>
          <div className="message-info w-full flex flex-row justify-end items-center gap-1">
            <span
              className={`message-time ${
                target === MessageTarget.SENDER
                  ? "text-[#60b75e] dark:text-[#aea7de]"
                  : "text-[#47494c]"
              } text-xs`}
            >
              {time}
            </span>
            {target === MessageTarget.SENDER && (
              <span className="message-status">
                {status === MessageStatus.SENT && (
                  <Clock className="w-3 text-[#4eb25b] dark:text-white font-bold" />
                )}
                {status === MessageStatus.DELIVERED && (
                  <CheckIcon className="text-[#4eb25b] dark:text-white font-bold" />
                )}
                {status === MessageStatus.READ && (
                  <CheckCheckIcon className="w-4 text-[#4eb25b] dark:text-white font-bold" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If not redacted, render the document message as usual
  return (
    <div
      className={`w-full px-32 flex flex-row ${
        target === MessageTarget.SENDER ? "justify-end" : "justify-start"
      }`}
      data-event-id={eventId} // Utilizing eventId as a data attribute
    >
      <Dropdown
        classNames={{
          base: "before:bg-default-200", // change arrow background
          content: "py-1 px-1 backdrop-blur-md bg-opacity-80" // change dropdown content
        }}
        isOpen={isPopoverOpen}
        placement="right"
        onOpenChange={setIsPopoverOpen}
      >
        <DropdownTrigger>
          <div
            className={`relative base-message ${
              target === MessageTarget.SENDER
                ? "message-sender text-black bg-[#eeffde] dark:text-white dark:!bg-[#766ac8] rounded-l-xl rounded-t-xl"
                : "bg-white dark:bg-[#212121] rounded-xl"
            } flex flex-col gap-1 max-w-[33%] py-3 px-3`}
            onContextMenu={handleContextMenu}
          >
            <button
              className="message-content document-message flex items-center gap-2 w-full h-full"
              onClick={handleDocumentClick}
            >
              <div className="document-icon text-2xl">
                <FaFile />
              </div>
              <div className="document-info max-w-60">
                <div className="document-name font-semibold truncate">
                  {documentName}
                </div>
                <div className="document-size text-left text-sm">
                  {documentSize}
                </div>
              </div>
            </button>
            <div className="message-info w-full flex flex-row justify-end items-center gap-1">
          <span
            className={`message-time ${
              target === MessageTarget.SENDER
                ? "text-[#60b75e] dark:text-[#aea7de]"
                : "text-[#47494c]"
            } text-xs`}
          >
            {time}
          </span>
              {target === MessageTarget.SENDER && (
                <span className="message-status">
              {status === MessageStatus.SENT && (
                <Clock className="w-3 text-[#4eb25b] dark:text-white font-bold" />
              )}
                  {status === MessageStatus.DELIVERED && (
                    <CheckIcon className="text-[#4eb25b] dark:text-white font-bold" />
                  )}
                  {status === MessageStatus.READ && (
                    <CheckCheckIcon className="w-4 text-[#4eb25b] dark:text-white font-bold" />
                  )}
            </span>
              )}
            </div>
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="Message Actions" variant="faded">
          {actions}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
