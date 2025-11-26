import { MessageSquare } from "lucide-react";
import { Box, Typography, Paper } from "@mui/material";

const NoChatSelected = () => {
  return (
    <Box
className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-white dark:bg-[#121212]"


    >
      <Box className="max-w-md text-center space-y-6">

        {/* Icon Display */}
        <Box className="flex justify-center gap-4 mb-4">
          <Paper
            elevation={3}
            className="w-16 h-16 rounded-2xl flex items-center justify-center animate-bounce"
            sx={{
              backgroundColor: "rgba(59, 130, 246, 0.1)", // primary/10
            }}
          >
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </Paper>
        </Box>

        {/* Welcome Text */}
        <Typography variant="h5"  className="text-gray-900">
          Welcome to Chatty!
        </Typography>

        <Typography variant="body1" className="text-gray-900">
          Select a conversation from the sidebar to start chatting
        </Typography>
      </Box>
    </Box>
  );
};

export default NoChatSelected;
