import * as appointment from '../services/appointmentService.js'

export const getAllAppointments = async (req, res) => {
  try {
    const result = await appointment.getAllAppointments()
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

export const getAppointmentById = async (req, res) => {
  try {
    const result = await appointment.getAppointmentById(req.params.id)
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}

export const createAppointment = async (req, res) => {
  try {
    const result = await appointment.createAppointment(req.body)
    res.status(201).json({ status: 'success', data: result })
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
}

export const updateAppointment = async (req, res) => {
  try {
    const result = await appointment.updateAppointment(req.params.id, req.body)
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}

export const deleteAppointment = async (req, res) => {
  try {
    await appointment.deleteAppointment(req.params.id)
    res.json({ status: 'success', message: 'Appointment deleted' })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}
