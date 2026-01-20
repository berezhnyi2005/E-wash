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
    const { rating, comment, userId } = req.body
    const file = req.file

    const numericRating = Number(rating)
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Hodnotenie musí byť číslo v rozmedzí 1 až 5.'
      })
    }

    const trimmedComment = (comment || '').trim()
    if (!trimmedComment || trimmedComment.length < 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Komentár musí mať aspoň 5 znakov.'
      })
    }

    const numericUserId = Number(userId)
    if (!Number.isFinite(numericUserId) || numericUserId <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Neplatné userId.'
      })
    }

    const imgReview = file
      ? `/uploads/reviews/${file.filename}`
      : null

    const result = await review.createReview({
      userId: numericUserId,
      rating: numericRating,
      comment: trimmedComment,
      imgReview
    })

    res.status(201).json({ status: 'success', data: result })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

export const updateReview = async (req, res) => {
  try {
    const { adminReview } = req.body
    const file = req.file

    // admin reply only
    if (adminReview !== undefined) {
      const trimmed = String(adminReview).trim()
      if (trimmed.length < 3) {
        return res.status(400).json({
          status: 'error',
          message: 'Odpoveď musí mať aspoň 3 znaky.'
        })
      }

      const result = await review.updateReview(req.params.id, {
        adminReview: trimmed
      })

      return res.json({ status: 'success', data: result })
    }

    const updateData = {}

    if (file) {
      updateData.imgReview = `/uploads/reviews/${file.filename}`
    }

    const result = await review.updateReview(req.params.id, updateData)
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
