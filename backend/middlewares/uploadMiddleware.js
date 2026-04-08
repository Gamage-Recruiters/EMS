import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const ALLOWED_FILETYPES = /jpg|jpeg|png|webp/;

const checkFileType = (file, cb) => {
  const extname = ALLOWED_FILETYPES.test(path.extname(file.originalname).toLowerCase());
  const mimetype = ALLOWED_FILETYPES.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Only JPG, PNG, or WEBP images are allowed');
  }
};

const MAX_FILE_SIZE = process.env.MAX_UPLOAD_BYTES
  ? parseInt(process.env.MAX_UPLOAD_BYTES, 10)
  : 5 * 1024 * 1024; // 5 MB default

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;