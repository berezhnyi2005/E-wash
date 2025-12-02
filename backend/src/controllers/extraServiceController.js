import * as extraService from '../services/extraServiceService.js'

export const getAllExtraServices = async (req, res) => {
  try {
    const result = await extraService.getAllExtraServices()
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

export const getExtraServiceById = async (req, res) => {
  try {
    const result = await extraService.getExtraServiceById(req.params.id)
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}

export const createExtraService = async (req, res) => {
  try {
    const result = await extraService.createExtraService(req.body)
    res.status(201).json({ status: 'success', data: result })
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
}

export const updateExtraService = async (req, res) => {
  try {
    const result = await extraService.updateExtraService(req.params.id, req.body)
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}

export const deleteExtraService = async (req, res) => {
  try {
    await extraService.deleteExtraService(req.params.id)
    res.json({ status: 'success', message: 'extraService deleted' })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}
