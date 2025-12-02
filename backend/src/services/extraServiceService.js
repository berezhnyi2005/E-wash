import * as repo from '../repositories/extraServiceRepository.js'

export const getAllExtraServices = async () => {
  return await repo.getAll()
}

export const getExtraServiceById = async (id) => {
  const service = await repo.getById(id)
  if (!service) throw new Error('Service not found')
  return service
}

export const createExtraService = async (data) => {
  return await repo.create(data)
}

export const updateExtraService = async (id, data) => {
  const existing = await repo.getById(id)
  if (!existing) throw new Error('Service not found')

  return await repo.update(id, data)
}

export const deleteExtraService = async (id) => {
  const existing = await repo.getById(id)
  if (!existing) throw new Error('Service not found')

  await repo.remove(id)
  return true
}
