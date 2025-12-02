import * as service from '../services/serviceService.js'

export const getAllServices = async (req, res) => {
  try {
    const result = await service.getAllServices()
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

export const getServiceById = async (req, res) => {
  try {
    const result = await service.getServiceById(req.params.id)
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}

export const createService = async (req, res) => {
  try {
    const result = await service.createService(req.body)
    res.status(201).json({ status: 'success', data: result })
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
}

export const updateService = async (req, res) => {
  try {
    const result = await service.updateService(req.params.id, req.body)
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}

export const deleteService = async (req, res) => {
  try {
    await service.deleteService(req.params.id)
    res.json({ status: 'success', message: 'Service deleted' })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}
