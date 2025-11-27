// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import path from "path";

// import { connectDB } from "./lib/db.js";
// import authRoutes from "./routes/auth.route.js";
// import messageRoutes from "./routes/message.route.js";
// import { app, server } from "./lib/socket.js";

// dotenv.config();

// const PORT = process.env.PORT || 5001;
// const __dirname = path.resolve();


// app.use(express.json({ limit: "30mb" }));
// app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// // ---------------------------------------------
// // PROPER CORS FOR VITE FRONTEND
// // ---------------------------------------------
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use(cookieParser());

// // ---------------------------------------------
// // ROUTES
// // ---------------------------------------------
// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// // ---------------------------------------------
// // 🔥 FIX 3: PRODUCTION BUILD SUPPORT
// // ---------------------------------------------
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get(".*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist" , "index.html"));
//   });
// }

// // ---------------------------------------------
// // START SERVER
// // ---------------------------------------------
// server.listen(PORT, () => {
//   console.log(`Server running on PORT: ${PORT}`);
//   connectDB();
// });
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ---------------------------------------------
// ✅ FIX FOR RENDER + NODE 22
// No wildcard routes — use app.use() fallback
// ---------------------------------------------
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(distPath));

  // fallback for ALL non-API routes
  app.use((req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// START SERVER
server.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
  connectDB();
});
