const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "photo") {
      cb(null, "public/moviePhoto");
    } else if (file.fieldname === "backdrop") {
      cb(null, "public/movieBackdrop");
    } else {
      cb(null, "public/other");
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${timestamp}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/gif"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Dozvoljene su samo slike (.jpg, .png, .gif)"), false);
  }
  cb(null, true);
};

const uploadMovieData = multer({ storage, fileFilter }).fields([
  { name: "photo", maxCount: 1 },
  { name: "backdrop", maxCount: 1 },
]);

module.exports = uploadMovieData;
