import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"? "http://localhost:5001" : "/";
    
   

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // ===================== CHECK AUTH =====================
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
      get().disconnectSocket();
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ===================== SIGNUP =====================
  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ===================== LOGIN =====================
  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ===================== LOGOUT =====================
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      set({ authUser: null });
      toast.success("Logged out");

      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  // ===================== UPDATE PROFILE PIC =====================
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put("/auth/update-profile", data);

      set((state) => ({
        authUser: { ...state.authUser, profilePic: res.data.profilePic }
      }));

      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // ===================== SOCKET CONNECT =====================
  connectSocket: () => {
  const { authUser, socket } = get();

  if (!authUser) return;

  // Always replace old socket (prevents stale socket issues)
  if (socket) {
    socket.disconnect();
  }

  const newSocket = io(BASE_URL, {
    query: { userId: authUser._id },
    transports: ["websocket"],
  });

  newSocket.on("connect", () => {
    console.log("🔌 Socket connected:", newSocket.id);
  });

  newSocket.on("getOnlineUsers", (userIds) => {
    set({ onlineUsers: userIds });
  });

  set({ socket: newSocket });
},

  // ===================== SOCKET DISCONNECT =====================
  disconnectSocket: () => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.disconnect();
      console.log("🔌 Socket disconnected");
    }
    set({ socket: null });
  },


// useAuthStore.js

deleteUser: async (userId) => {
  try {
    const res = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete user");

    set((state) => ({
      users: state.users.filter((u) => u._id !== userId),
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
}


}));
