import File from "../models/file.model.js";
import crypto from "crypto";
import cron from "node-cron";
import fs from "fs";

// Function to generate a secure code using crypto
const generateSecureCode = async function () {
  const code = await crypto.randomBytes(256).toString("hex");
  const secureCode = await crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");
  return secureCode;
};

// Controller function for handling file uploads
export const uploadFile = async (req, res) => {
  const { path, originalname: name } = req.file;
  const { maxDownload } = req.body;

  try {
    // Generate a secure code for the uploaded file
    const secureCode = await generateSecureCode();

    // Create a new file document in the database
    const file = await File.create({ path, name, secureCode, maxDownload });

    // Return a success response with the file's download URL
    return res.status(200).json({
      success: true,
      path: `${process.env.BACKEND_URL}/api/v1/file/?id=${file._id}&code=${file.secureCode}`,
    });
  } catch (error) {
    // Handle errors and return an error response
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Controller function for handling file downloads
export const downloadFile = async (req, res) => {
  const { id, code } = req.query;
  try {
    // Find the file with the provided id and secure code
    const file = await File.findOne({ _id: id, secureCode: code });
    if (!file)
      return res.status(400).json({
        success: false,
        message: "Invalid url/Reached maximum download limit",
      });

    // Increment the download count for the file
    file.downloadCount++;

    await file.save();

    // Download the file
    res.download(file.path, file.name);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Cron job to periodically delete files that have reached their download limit
cron.schedule(
  // Schedule to run daily at 12:00 AM
  "* 59 23 * * *",
  async () => {
    try {
      // Find files that have reached their download limit
      const filesToDelete = await File.find({
        $expr: {
          $gte: ["$downloadCount", "$maxDownload"],
        },
      });

      // Delete the files and their database records
      filesToDelete.forEach(async (file) => {
        fs.unlinkSync(file.path);
        await File.findByIdAndRemove(file._id);
        console.log(`Deleted file: ${file.name}`);
      });
    } catch (error) {
      console.log(error);
    }
  },
  {
    timezone: "Asia/Kolkata", // Set the timezone for the cron job
  }
);
