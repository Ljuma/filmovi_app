const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/userPhotos");
  },
  filename: (req, file, cb) => {
    let email = req.body.email || "unknown";
    email = email.replace(/[@.]/g, "-");
    const ext = path.extname(file.originalname);
    cb(null, `${email}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/gif"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Dozvoljene su samo slike (.jpg, .png, .gif)"), false);
  }
  cb(null, true);
};

const uploadUserPhoto = multer({ storage, fileFilter });
module.exports = uploadUserPhoto;
