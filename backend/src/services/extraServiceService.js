import * as repo from '../repositories/extraServiceRepository.js'

export const getAllExtraServices = async () => {
  return await repo.getAll()
}

export const getExtraServiceById = async (id) => {
  const extraService = await repo.getById(id)
  if (!extraService) throw new Error('extraService not found')
  return extraService
}

export const createExtraService = async (data) => {
  return await repo.create(data)
}

export const updateExtraService = async (id, data) => {
  const existing = await repo.getById(id)
  if (!existing) throw new Error('extraService not found')

  return await repo.update(id, data)
}

export const deleteExtraService = async (id) => {
  const existing = await repo.getById(id)
  if (!existing) throw new Error('extraService not found')

  await repo.remove(id)
  return true
}
