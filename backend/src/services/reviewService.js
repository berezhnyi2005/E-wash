import * as repo from '../repositories/reviewRepository.js'

export const getAllReviews = async () => {
  return await repo.getAll()
}

export const getReviewById = async (id) => {
  const review = await repo.getById(id)
  if (!review) throw new Error('Review not found')
  return review
}

export const createReview = async (data) => {
  return await repo.create(data)
}

export const updateReview = async (id, data) => {
  const existing = await repo.getById(id)
  if (!existing) throw new Error('Review not found')

  return await repo.update(id, data)
}

export const deleteReview = async (id) => {
  const existing = await repo.getById(id)
  if (!existing) throw new Error('Review not found')

  await repo.remove(id)
  return true
}
