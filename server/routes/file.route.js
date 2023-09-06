import express from "express";
import { singleUpload } from "../config/multer.js";
import { downloadFile, uploadFile } from "../controller/file.controller.js";
const router = express.Router();

// Route to handle file uploads using multer middleware
router.post("/upload", singleUpload, uploadFile);

// Route to handle file downloads
router.get("/file", downloadFile);

export default router;
