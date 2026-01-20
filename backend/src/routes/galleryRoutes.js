import express from "express"
import * as controller from "../controllers/galleryController.js"
import { uploadGalleryImages } from "../middlewares/upload.js"

const router = express.Router()

// GET
router.get("/", controller.getAllGalleryItems)
router.get("/:id", controller.getGalleryItem)

// CREATE
router.post(
  "/",
  uploadGalleryImages,
  controller.createGalleryItem
)

// UPDATE 
router.put(
  "/:id",
  uploadGalleryImages,
  controller.updateGalleryItem
)

// DELETE
router.delete("/:id", controller.deleteGalleryItem)

export default router
