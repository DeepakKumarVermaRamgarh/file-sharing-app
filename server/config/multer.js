import multer from "multer";

export const singleUpload = multer({ dest: "./uploads" }).single("file");
