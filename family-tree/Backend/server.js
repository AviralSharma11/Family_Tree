import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import familyRoutes from "./routes/familyRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Use routes
app.use("/api/family", familyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
