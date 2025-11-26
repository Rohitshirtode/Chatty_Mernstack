

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

import { Avatar, Box, Typography, Paper } from "@mui/material";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
    updateMessage
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // REQUIRED STATES FOR EDIT/DELETE
  const [menuMessageId, setMenuMessageId] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);

  useEffect(() => {
    if (!selectedUser?._id) return;

    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser?._id]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-gray-50">
      <ChatHeader />

      {/* MESSAGE LIST */}
      <div className="flex-1 flex flex-col overflow-auto bg-gray-50 dark:bg-gray-900 p-2">

        {messages.map((message) => {
          const isOwn = message.senderId === authUser._id;

          return (
            <Box
              key={message._id}
              className={`flex items-start gap-3 mb-2 ${
                isOwn ? "justify-end" : "justify-start"
              }`}
            >
              {!isOwn && (
                <Avatar
                  src={selectedUser.profilepic || "/avatar.png"}
                  sx={{ width: 40, height: 40 }}
                />
              )}

              <Box className="max-w-xs relative">
                <Typography variant="caption" className="opacity-60 mb-1 block text-right">
                  {formatMessageTime(message.createdAt)}
                </Typography>

                <Paper
                  elevation={2}
                  className={`p-4 rounded-2xl relative ${
                    isOwn
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white rounded-bl-none"
                  }`}
                >
                  {/* ⋮ MENU BUTTON */}
                  {isOwn && (
                   <div className="absolute bottom-7 right-0 cursor-pointer text-xl font-extrabold px-2 py-1 hover:scale-110 transition">
                      <button
                        onClick={() =>
                          setMenuMessageId(
                            menuMessageId === message._id ? null : message._id
                          )
                        } 
                      >
                        ⋮
                      </button>
                    </div>
                  )}

                  {/* MENU OPTIONS */}
                  {menuMessageId === message._id && (
                    <div className="absolute right-0 top-3 bg-white shadow-md rounded-md z-50 p-4 text-black">
                      <button
                        className="block w-full text-left px-3 py-1 hover:bg-gray-200"
                        onClick={() => setEditingMessage(message)}
                      >
                        Edit
                      </button>

                      <button
                        className="block w-full text-left px-3 py-1 hover:bg-red-200 text-red-600"
                        onClick={() => deleteMessage(message._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {/* IMAGE MESSAGE */}
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="max-w-[200px] rounded-md mb-2"
                    />
                  )}

                  {/* TEXT MESSAGE */}
                  {message.text && <p>{message.text}</p>}
                </Paper>
              </Box>

              {isOwn && (
                <Avatar
                  src={authUser.profilepic || "/avatar.png"}
                  sx={{ width: 40, height: 40 }}
                />
              )}
            </Box>
          );
        })}

        <div ref={messageEndRef}></div>
      </div>

      {/* 🔵 EDITING UI */}
      {editingMessage && (
        <div className="p-3 bg-gray-200 flex gap-2">
          <input
            className="flex-1 p-2 border rounded-lg"
            value={editingMessage.text}
            onChange={(e) =>
              setEditingMessage({ ...editingMessage, text: e.target.value })
            }
          />

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => {
              updateMessage(editingMessage._id, editingMessage.text);
              setEditingMessage(null);
            }}
          >
            Save
          </button>

          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            onClick={() => setEditingMessage(null)}
          >
            Cancel
          </button>
        </div>
      )}

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
