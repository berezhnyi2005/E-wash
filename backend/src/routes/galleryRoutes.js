import express from "express";
import * as controller from "../controllers/galleryController.js";
import { uploadGalleryImages } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", controller.getAllGalleryItems);
router.get("/:id", controller.getGalleryItem);
router.post("/", uploadGalleryImages, controller.createGalleryItem);
router.put("/:id", uploadGalleryImages, controller.updateGalleryItem);
router.delete("/:id", controller.deleteGalleryItem);

export default router;
