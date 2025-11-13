const fs = require('fs');
const path = require('path');
const multer = require('multer');
const config = require('../config/config');

const uploadDir = path.join(__dirname, '..', '..', config.uploadDir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-z0-9.\-_]/gi, '_');
    const timestamp = Date.now();
    cb(null, `${timestamp}-${safeName}`);
  }
});

const fileFilter = (_req, file, cb) => {
  const allowed = [
    'image/png',
    'image/jpeg',
    'application/pdf',
    'text/plain'
  ];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Unsupported attachment type'));
  }
  return cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
});

module.exports = upload;

