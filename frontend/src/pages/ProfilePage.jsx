import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

import {
  Avatar,
  Box,
  Typography,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  // 🔧 FIXED handleImageUpload — correct base64 + error safe
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    // 🔧 FIXED — ALWAYS use onloadend, not onload
    reader.onloadend = async () => {
      const base64Image = reader.result; // full "data:image/png;base64,..."

      setSelectedImg(base64Image);

      try {
        await updateProfile({ profilePic: base64Image });
      } catch (error) {
        console.log("Error uploading image:", error);
      }
    };

    // 🔧 FIXED — ensure Cloudinary-compatible base64
    reader.readAsDataURL(file);
  };

  return (
    <Box className="h-screen pt-20 bg-gray-100">
      <Box className="max-w-2xl mx-auto p-4 py-8">

        <Paper
          elevation={3}
          className="rounded-xl p-6 space-y-8"
          sx={{ backgroundColor: "white" }}
        >
          {/* Header */}
          <Box className="text-center space-y-1">
            <Typography variant="h5" className="font-semibold">
              Profile
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Your profile information
            </Typography>
          </Box>

          {/* Avatar Upload */}
          <Box className="flex flex-col items-center gap-4">
            <Box className="relative">
              <Avatar
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                sx={{
                  width: 120,
                  height: 120,
                  border: "4px solid #e5e7eb",
                }}
              />

              {/* Upload Button */}
              <IconButton
                component="label"
                size="small"
                className={`!absolute bottom-2 right-2 bg-gray-800 hover:scale-105 transition-all ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
                sx={{ width: 36, height: 36 }}
              >
                <Camera className="w-5 h-5 text-white" />

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  // 🔧 FIXED — correct handler
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </IconButton>
            </Box>

            <Typography variant="body2" className="text-gray-500">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </Typography>
          </Box>

          {/* User Info */}
          <Box className="space-y-6">

            {/* Full Name */}
            <Box className="space-y-1">
              <Typography
                variant="caption"
                className="flex items-center gap-2 text-gray-500"
              >
                <User className="w-4 h-4" />
                Full Name
              </Typography>

              <Paper
                elevation={0}
                className="px-4 py-3 bg-gray-100 rounded-lg border"
                sx={{ borderColor: "#e5e7eb" }}
              >
                {authUser?.fullName}
              </Paper>
            </Box>

            {/* Email */}
            <Box className="space-y-1">
              <Typography
                variant="caption"
                className="flex items-center gap-2 text-gray-500"
              >
                <Mail className="w-4 h-4" />
                Email Address
              </Typography>

              <Paper
                elevation={0}
                className="px-4 py-3 bg-gray-100 rounded-lg border"
                sx={{ borderColor: "#e5e7eb" }}
              >
                {authUser?.email}
              </Paper>
            </Box>
          </Box>

          {/* Account Info Box */}
          <Paper
            elevation={1}
            className="rounded-xl p-6"
            sx={{ backgroundColor: "#f9fafb" }}
          >
            <Typography variant="h6" className="font-medium mb-4">
              Account Information
            </Typography>

            <Box className="space-y-3 text-sm">

              {/* Member Since */}
              <Box className="flex items-center justify-between py-2 border-b"
                sx={{ borderColor: "#d1d5db" }}
              >
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </Box>

              {/* Account Status */}
              <Box className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </Box>

            </Box>
          </Paper>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProfilePage;
