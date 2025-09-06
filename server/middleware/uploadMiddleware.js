import multer from "multer";
import path from "path";
import fs from "fs";

// Cấu hình multer để upload ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.originalname;
    const filePath = path.join("uploads", filename);

    // Nếu trùng tên, xóa file cũ (cực hiếm nếu dùng timestamp, nhưng đề phòng)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

export default upload;