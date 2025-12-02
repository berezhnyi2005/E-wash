import * as repo from '../repositories/userRepository.js'

export const getAllUsers = async () => {
  return await repo.getAll()
}

export const getUserById = async (id) => {
  const user = await repo.getById(id)
  if (!user) throw new Error('User not found')
  return user
}

export const createUser = async (data) => {
  return await repo.create(data)
}

export const updateUser = async (id, data) => {
  const existing = await repo.getById(id)
  if (!existing) throw new Error('User not found')

  return await repo.update(id, data)
}

export const deleteUser = async (id) => {
  const existing = await repo.getById(id)
  if (!existing) throw new Error('User not found')

  await repo.remove(id)
  return true
}
