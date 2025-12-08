
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
    const { rating, comment, imgReview, userId } = req.body

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

    let cleanedImgReview = null
    
    if (imgReview != null && String(imgReview).trim() !== '') {
      cleanedImgReview = String(imgReview).trim()
      if (cleanedImgReview.length < 10) {
        return res.status(400).json({
          status: 'error',
          message: 'URL fotky vyzerá neplatná (príliš krátka).'
        })
      }
    }

    const result = await review.createReview({
      userId,                 
      rating: numericRating, 
      comment: trimmedComment,
      imgReview: cleanedImgReview
    })

    res.status(201).json({ status: 'success', data: result })
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
}

export const updateReview = async (req, res) => {
  try {
    const { rating, comment, imgReview, userId, adminReview } = req.body

    const isAdminReplyOnly =
      typeof adminReview === 'string' &&
      rating === undefined &&
      comment === undefined &&
      imgReview === undefined &&
      userId === undefined

    if (isAdminReplyOnly) {
      const trimmedAdminReply = adminReview.trim()

      if (!trimmedAdminReply || trimmedAdminReply.length < 3) {
        return res.status(400).json({
          status: 'error',
          message: 'Odpoveď musí mať aspoň 3 znaky.'
        })
      }

      const result = await review.updateReview(req.params.id, {
        adminReview: trimmedAdminReply
      })

      return res.json({ status: 'success', data: result })
    }

    // zmena celey recenzie/ do buducnosti mozno budem potrebovat

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

    let cleanedImgReview = null
    if (imgReview != null && String(imgReview).trim() !== '') {
      cleanedImgReview = String(imgReview).trim()
      if (cleanedImgReview.length < 10) {
        return res.status(400).json({
          status: 'error',
          message: 'URL fotky vyzerá byť neplatná (príliš krátka).'
        })
      }
    }

    const result = await review.updateReview(req.params.id, {
      userId,
      rating: numericRating,
      comment: trimmedComment,
      imgReview: cleanedImgReview
    })

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
