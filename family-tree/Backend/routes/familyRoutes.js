import express from "express";
import multer from "multer";
import path from "path";
import { getFamilyTree, addMember } from "../controllers/familyController.js";

const router = express.Router();

// set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// endpoints
router.get("/", getFamilyTree);
router.post("/", upload.single("image"), addMember);

export default router;
