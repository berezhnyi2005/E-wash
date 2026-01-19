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
    const data = await service.getMyAppointments(req.user.id)
    res.json({ status: "success", data })
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message })
  }
}

export const createAppointment = async (req, res) => {
  try {
    const data = await service.createAppointment({
      userId: req.body.userId,   // 👈 ВРЕМЕННО
      serviceId: req.body.serviceId,
      dateTime: req.body.dateTime,
      notes: req.body.notes
    })

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
