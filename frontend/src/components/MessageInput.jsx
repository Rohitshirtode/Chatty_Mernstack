import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

import {
  Box,
  IconButton,
  TextField,
  Paper,
  InputAdornment,
  Avatar,
} from "@mui/material";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Box className="p-4 w-full bg-white border-t" sx={{ borderColor: "#e5e7eb" }}>
      {/* Image preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <Avatar
              variant="rounded"
              src={imagePreview}
              sx={{ width: 80, height: 80, borderRadius: "10px" }}
            />

            <IconButton
              size="small"
              onClick={removeImage}
              className="!absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300"
              sx={{ width: 22, height: 22 }}
            >
              <X size={14} />
            </IconButton>
          </div>
        </div>
      )}

      {/* Input box */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <Paper
          className="flex-1 flex items-center px-2 py-1 shadow-sm"
          sx={{ borderRadius: "10px" }}
        >
          <TextField
            variant="standard"
            fullWidth
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: { paddingX: 1 },
            }}
          />

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />

          {/* Image button */}
          <IconButton onClick={() => fileInputRef.current?.click()}>
            <Image size={20} className={imagePreview ? "text-emerald-600" : "text-gray-500"} />
          </IconButton>
        </Paper>

        {/* Send button */}
        <IconButton
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="bg-blue-600 text-white hover:bg-blue-700"
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
          }}
        >
          <Send size={20} />
        </IconButton>
      </form>
    </Box>
  );
};

export default MessageInput;
