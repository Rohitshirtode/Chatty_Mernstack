import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Box,
} from "@mui/material";
import chat from "../store/chat.avif"

import { Eye, EyeOff, Mail, Lock, MessageSquare } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-[#ae90e2]">

      {/* LEFT SECTION */}
      <div className="flex flex-col justify-center items-center p-10">
        <div className="w-full max-w-md space-y-10">

          {/* APP LOGO */}
          <div className="text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-blue-600" />
              </div>
              <Typography className="text-gray-900" variant="h4" fontWeight="bold">
                Welcome Back
              </Typography>
              <Typography className="text-gray-900">
                Sign in to your account
              </Typography>
            </div>
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={20} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              variant="outlined"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff /> : <Eye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 1,
                background: "linear-gradient(135deg, #6a11cb 50%, #2575fc 100%)",
                color: "white",
                borderRadius: "8px",
                paddingY: "10px",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a0cb8 0%, #1f63d6 100%)",
                },
              }}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Loading..." : "Login"}
            </Button>
          </form>

          {/* Bottom Link */}
          <div className="text-center">
            <Typography variant="body2" className="text-gray-900">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                Create Account
              </Link>
            </Typography>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (OPTIONAL IMAGE SECTION) */}
      <div
        className="hidden lg:flex flex-col justify-center items-center text-white p-10 bg-[#09516d]"

        style={{
          background: "linear-gradient(135deg, #6a11cb 50%, #2575fc 100%)",
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Chatty
        </Typography>
        <Typography className="mt-4 text-lg">
          Connect with your friends anytime, anywhere.
        </Typography>
        <img
      src={chat}   // change path to your actual image
      alt="Chat App"
      className="w-[300px] h-[300px] object-cover rounded-full shadow-lg mb-6"
    />

      </div>
    </div>
  );
};

export default LoginPage;
