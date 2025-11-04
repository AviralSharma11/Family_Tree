import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import familyRoutes from "./routes/familyRoutes.js";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/family", familyRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
