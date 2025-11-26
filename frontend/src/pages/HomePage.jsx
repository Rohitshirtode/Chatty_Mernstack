import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

import { Box, Paper } from "@mui/material";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <Box className="h-screen bg-gray-100">
      <Box className="flex items-center justify-center pt-20 px-4 h-full">

        <Paper
          elevation={3}
          className="w-full max-w-6xl h-[calc(100vh-8rem)] rounded-xl overflow-hidden"
          sx={{
            backgroundColor: "white",
            borderRadius: "16px",
          }}
        >

          <Box className="flex h-full">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Chat Area */}
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}

          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default HomePage;
