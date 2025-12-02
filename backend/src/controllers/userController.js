import * as user from '../services/userService.js'

export const getAllUsers = async (req, res) => {
  try {
    const result = await user.getAllUsers()
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

export const getUserById = async (req, res) => {
  try {
    const result = await user.getUserById(req.params.id)
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}

export const createUser = async (req, res) => {
  try {
    const result = await user.createUser(req.body)
    res.status(201).json({ status: 'success', data: result })
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const result = await user.updateUser(req.params.id, req.body)
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    await user.deleteUser(req.params.id)
    res.json({ status: 'success', message: 'User deleted' })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}
