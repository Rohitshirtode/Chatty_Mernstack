import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
} from "@mui/material";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <Box className="h-screen container mx-auto px-4 pt-20 max-w-5xl  bg-white dark:bg-[#121212]">
      <Box className="space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <Typography variant="h6" className="font-semibold">
            Theme
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Choose a theme for your chat interface
          </Typography>
        </div>

        {/* Theme Options */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <Paper
              key={t}
              elevation={theme === t ? 3 : 0}
              onClick={() => setTheme(t)}
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg cursor-pointer
                transition-all border 
                ${theme === t ? "bg-gray-200" : "hover:bg-gray-100"}
              `}
            >
              <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-gradient-to-r from-black to-white" />
                 
                  <div className="rounded bg-gray-900" />
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </Paper>
          ))}
        </div>

        {/* Preview Section */}
        <Typography variant="h6" className="font-semibold mb-3">
          Preview
        </Typography>

        <Paper
          elevation={3}
          className="rounded-xl overflow-hidden border shadow-lg"
          sx={{ borderColor: "#e5e7eb", backgroundColor: "white" }}
        >
          <Box className="p-4 bg-gray-100">

            <Box className="max-w-lg mx-auto">

              <Paper
                elevation={1}
                className="rounded-xl overflow-hidden shadow-sm"
              >

                {/* Chat Header */}
                <Box className="px-4 py-3 border-b bg-white flex items-center gap-3"
                  sx={{ borderColor: "#e5e7eb" }}
                >
                  <Box className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    J
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" className="font-medium">
                      John Doe
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      Online
                    </Typography>
                  </Box>
                </Box>

                {/* Messages */}
                <Box className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-white">
                  {PREVIEW_MESSAGES.map((m) => (
                    <Box
                      key={m.id}
                      className={`flex ${m.isSent ? "justify-end" : "justify-start"}`}
                    >
                      <Paper
                        elevation={2}
                        className={`
                          max-w-[80%] rounded-xl p-3
                          ${m.isSent ? "bg-blue-600 text-white" : "bg-gray-200"}
                        `}
                      >
                        <Typography variant="body2">{m.content}</Typography>
                        <Typography
                          variant="caption"
                          className={`block mt-1.5 ${
                            m.isSent ? "text-blue-100" : "text-gray-600"
                          }`}
                        >
                          12:00 PM
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>

                {/* Input Preview */}
                <Box
                  className="p-4 border-t bg-white flex gap-2"
                  sx={{ borderColor: "#e5e7eb" }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    value="This is a preview"
                    InputProps={{ readOnly: true }}
                  />

                  <Button
                    variant="contained"
                    sx={{ minWidth: 48, backgroundColor: "#2563eb" }}
                  >
                    <Send size={18} />
                  </Button>
                </Box>

              </Paper>

            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default SettingsPage;
