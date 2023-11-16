import multer from "multer";
import path from "path";
import util from "util";
const maxSize = 2 * 1024 * 1024;

// konfigurasi multer
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("uploud"));
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
      file.mimetype === "text/csv" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);

export default uploadFileMiddleware;
