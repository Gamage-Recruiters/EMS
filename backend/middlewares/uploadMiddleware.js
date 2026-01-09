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

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
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