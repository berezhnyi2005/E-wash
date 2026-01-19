import * as service from "../services/appointmentService.js"

export const getAllAppointments = async (req, res) => {
  try {
    const data = await service.getAllAppointments()
    res.json({ status: "success", data })
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message })
  }
}

export const getMyAppointments = async (req, res) => {
  try {
    const { userId } = req.params
    const data = await service.getMyAppointments(userId)
    res.json({ status: "success", data })
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message })
  }
}


export const getBusySlots = async (req, res) => {
  try {
    const { date } = req.query
    const data = await service.getBusySlotsByDate(date)
    res.json({ status: "success", data })
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message })
  }
}

export const createAppointment = async (req, res) => {
  try {
    const data = await service.createAppointment(req.body)
    res.status(201).json({ status: "success", data })
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message })
  }
}

export const updateStatus = async (req, res) => {
  try {
    const data = await service.changeStatus(req.params.id, req.body.status)
    res.json({ status: "success", data })
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message })
  }
}

export const deleteAppointment = async (req, res) => {
  try {
    await service.deleteAppointment(req.params.id)
    res.json({ status: "success" })
  } catch (err) {
    res.status(404).json({ status: "error", message: err.message })
  }
}
