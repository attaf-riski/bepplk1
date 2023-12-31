import multer from "multer";
import path from "path";
import util from "util";
const maxSize = 2 * 1024 * 1024 * 1024;

// konfigurasi multer
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("images"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
}).single("image");

let uploadImageMiddleware = util.promisify(uploadFile);

export default uploadImageMiddleware;
