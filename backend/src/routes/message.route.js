import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  deleteMessage,
  updateMessage
} from "../controllers/message.controller.js";

const router = express.Router();

// Get user list for sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// Get chat messages with a user
router.get("/:id", protectRoute, getMessages);

// Send a new message
router.post("/send/:id", protectRoute, sendMessage);

//  Delete a message
router.delete("/:messageId", protectRoute, deleteMessage);

//  Update/Edit a message
router.put("/:messageId", protectRoute, updateMessage);

// PUT /api/users/deactivate/:id




export default router;
