import express from 'express'
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js'
import { uploadReviewImage } from '../middlewares/uploadReview.js'

const router = express.Router()

router.get('/', getAllReviews)
router.get('/:id', getReviewById)

router.post('/', uploadReviewImage, createReview)
router.put('/:id', uploadReviewImage, updateReview)

router.delete('/:id', deleteReview)

export default router
