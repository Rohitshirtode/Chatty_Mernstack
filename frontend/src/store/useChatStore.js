


import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({

  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  messageListener: null,

  /* ------------------ GET USERS ------------------ */
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");

      const myId = useAuthStore.getState().authUser?._id;
      const filteredUsers = res.data.filter(u => u._id !== myId);

      set({ users: filteredUsers });

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  /* ------------------ GET MESSAGES ------------------ */
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  /* ------------------ SEND MESSAGE ------------------ */
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set({ messages: [...messages, res.data] });

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send");
    }
  },

  /* ------------------ DELETE MESSAGE ------------------ */
  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);

      set((state) => ({
        messages: state.messages.filter(m => m._id !== messageId),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  },

  /* ------------------ UPDATE (EDIT) MESSAGE ------------------ */
  updateMessage: async (messageId, newText) => {
    try {
      const res = await axiosInstance.put(`/messages/${messageId}`, {
        text: newText,
      });

      set((state) => ({
        messages: state.messages.map(m =>
          m._id === messageId 
            ? { ...m, text: newText, edited: true }
            : m
        ),
      }));

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update message");
    }
  },

  /* ------------------ SUBSCRIBE TO SOCKET MESSAGES ------------------ */
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const selected = get().selectedUser;

    if (!socket || !selected) return;

    if (get().messageListener) {
      socket.off("newMessage", get().messageListener);
    }

    const listener = (newMessage) => {
      const selectedId = get().selectedUser?._id;

      if (!selectedId) return;

      const isRelated =
        newMessage.senderId === selectedId ||
        newMessage.receiverId === selectedId;

      if (!isRelated) return;

      set({ messages: [...get().messages, newMessage] });
    };

    socket.on("newMessage", listener);
    set({ messageListener: listener });
  },

  /* ------------------ UNSUBSCRIBE ------------------ */
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    const listener = get().messageListener;

    if (socket && listener) {
      socket.off("newMessage", listener);
      set({ messageListener: null });
    }
  },

  /* ------------------ SELECT USER ------------------ */
  setSelectedUser: (user) => {
    if (!user) {
      get().unsubscribeFromMessages();
      set({ selectedUser: null, messages: [] });
      return;
    }

    const safeUser = { ...user };

    set({ selectedUser: safeUser });

    get().getMessages(safeUser._id);
    get().subscribeToMessages();
  },


 
}));

