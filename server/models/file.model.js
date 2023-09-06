import mongoose from "mongoose";
import crypto from "crypto";

// Define the schema for the 'File' collection
const fileSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  maxDownload: {
    type: Number,
    default: 1,
  },
  secureCode: {
    type: String,
    required: true,
  },
});

// Middleware to execute before saving a file document
fileSchema.pre("save", async function (next) {
  // Check if the download count has reached the maximum limit
  if (this.downloadCount >= this.maxDownload) {
    // Generate a secure code using random bytes
    const code = await crypto.randomBytes(6).toString("hex");
    // Hash the code using SHA-256 to create a secure code
    this.secureCode = await crypto
      .createHash("sha256")
      .update(code)
      .digest("hex");
  }
  next();
});

const file = mongoose.model("File", fileSchema);
export default file;
