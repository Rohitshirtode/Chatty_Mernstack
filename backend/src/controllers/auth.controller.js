import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


// ==================== SIGNUP ====================
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    generateToken(newUser._id, res);

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      createdAt: newUser.createdAt,
    });

  } catch (error) {
    console.log("Error in signup:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



// ==================== LOGIN ====================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
    });

  } catch (error) {
    console.log("Error in login:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



// ==================== LOGOUT ====================
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// ==================== UPDATE PROFILE PIC ====================
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;

    // 1. Validate req.user (JWT)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;

    // 2. Validate image
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // 3. Ensure profilePic is base64 format Cloudinary accepts
    let imageToUpload = profilePic;

    if (!profilePic.startsWith("data:image")) {
      imageToUpload = `data:image/jpeg;base64,${profilePic}`;
    }

    // 4. Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(imageToUpload, {
      folder: "chatty_users",
    });

    // 5. Update DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    return res.status(200).json(updatedUser);

  } catch (error) {
    console.log("Cloudinary upload error:", error);
    return res.status(500).json({ message: "Image upload failed" });
  }
};


// ==================== CHECK AUTH (FIXED!!) ====================
export const checkAuth = async (req, res) => {
  try {
    // Fetch fresh, updated user from DB (IMPORTANT FIX)
    const user = await User.findById(req.user._id).select("-password");

    return res.status(200).json(user);

  } catch (error) {
    console.log("Error in checkAuth:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

