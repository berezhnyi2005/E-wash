import * as repo from '../repositories/serviceRepository.js'

export const getAllServices = async () => {
  return await repo.getAll()
}

export const getServiceById = async (id) => {
  const service = await repo.getById(id)
  if (!service) throw new Error('Service not found')
  return service
}

export const createService = async (data) => {
  return await repo.create(data)
}

export const updateService = async (id, data) => {
  const existing = await repo.getById(id)
  if (!existing) throw new Error('Service not found')

  return await repo.update(id, data)
}

export const deleteService = async (id) => {
  const existing = await repo.getById(id)
  if (!existing) throw new Error('Service not found')

  await repo.remove(id)
  return true
}
