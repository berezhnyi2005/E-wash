import * as review from '../services/reviewService.js'

export const getAllReviews = async (req, res) => {
  try {
    const result = await review.getAllReviews()
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

export const getReviewById = async (req, res) => {
  try {
    const result = await review.getReviewById(req.params.id)
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}

export const createReview = async (req, res) => {
  try {
    const result = await review.createReview(req.body)
    res.status(201).json({ status: 'success', data: result })
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
}

export const updateReview = async (req, res) => {
  try {
    const result = await review.updateReview(req.params.id, req.body)
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}

export const deleteReview = async (req, res) => {
  try {
    await review.deleteReview(req.params.id)
    res.json({ status: 'success', message: 'Review deleted' })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}
