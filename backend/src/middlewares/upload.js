import multer from "multer"
import path from "path"
import fs from "fs"

const uploadDir = "uploads/gallery"
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
  }
})

export const uploadGalleryImages = multer({
  storage
}).fields([
  { name: "before", maxCount: 1 },
  { name: "after", maxCount: 1 }
])
