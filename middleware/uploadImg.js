import { Storage } from '@google-cloud/storage';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Inisialisasi Google Cloud Storage
const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.KEY_FILENAME, // File JSON kunci dari Service Account
});

// Nama bucket Google Cloud Storage
const bucket = storage.bucket(process.env.BUCKET)

export const uploadHandler = multer({
  storage: multer.memoryStorage(), // Simpan di memori sebelum diunggah ke GCS
  limits: {
    fileSize: 5 * 1024 * 1024, // Maksimum ukuran file 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'), false);
    }
  },
});

export const deleteImgGCS = async (filename) => {
  try {
    await storage.bucket(process.env.BUCKET).file(`images/${filename}`).delete();
  } catch (error) {
    console.error(`Failed to delete file ${filename}:`, error);
  }
}

// Fungsi untuk mengupload file ke Google Cloud Storage
export const uploadToGCS = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const {originalname} = req.file
  const filename = originalname.replaceAll(' ', '-')

  const blob = bucket.file(`images/${Date.now()}-${filename}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on('error', (err) => {
    next(err);
  });

  blobStream.on('finish', () => {
    req.file.cloudStorageObject = blob.name;
    blob.makePublic().then(() => {
      req.file.Url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      next();
    });
  });

  blobStream.end(req.file.buffer);
};

