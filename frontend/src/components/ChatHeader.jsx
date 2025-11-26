import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { Avatar, Box, IconButton, Typography } from "@mui/material";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <Box
      // className="p-3 border-b bg-white"
     className="
  p-3 border-b
  bg-gradient-to-br from-[#d0d0e1] via-[#3e206c] to-[#4a2480]
  dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-black
"

      sx={{ borderColor: "#e5e7eb" }} // Tailwind gray-300
    >
      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          
          {/* Avatar */}
          <Avatar
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            sx={{ width: 40, height: 40 }}
          />

          {/* User info */}
          <div>
            <Typography variant="subtitle1" className="font-semibold">
              {selectedUser.fullName}
            </Typography>

            <Typography
              variant="body2"
              className="text-grey-500"
            >
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </Typography>
          </div>
        </div>

        {/* Close button */}
        <IconButton onClick={() => setSelectedUser(null)}>
          <X size={22} />
        </IconButton>
      </div>
    </Box>
  );
};

export default ChatHeader;
