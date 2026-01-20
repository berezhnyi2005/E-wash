import * as service from "../services/appointmentService.js"

const handleError = (res, err) => {
  if (err?.type === "VALIDATION_ERROR") {
    return res.status(400).json({
      status: "error",
      errors: err.errors
    })
  }

  return res.status(500).json({
    status: "error",
    message: err.message || "Internal server error"
  })
}

export const getAllAppointments = async (req, res) => {
  try {
    const data = await service.getAllAppointments()
    res.json({ status: "success", data })
  } catch (err) {
    handleError(res, err)
  }
}

export const getMyAppointments = async (req, res) => {
  try {
    const { userId } = req.query
    const data = await service.getMyAppointments(userId)
    res.json({ status: "success", data })
  } catch (err) {
    handleError(res, err)
  }
}


export const getBusySlots = async (req, res) => {
  try {
    const { date } = req.query
    const data = await service.getBusySlotsByDate(date)
    res.json({ status: "success", data })
  } catch (err) {
    handleError(res, err)
  }
}

export const createAppointment = async (req, res) => {
  try {
    const isAdmin = Boolean(req.body.isAdmin)


    const data = await service.createAppointment({
      ...req.body,
      isAdmin
    })

    res.status(201).json({ status: "success", data })
  } catch (err) {
    handleError(res, err)
  }
}


export const updateStatus = async (req, res) => {
  try {
    const data = await service.changeStatus(req.params.id, req.body.status)
    res.json({ status: "success", data })
  } catch (err) {
    handleError(res, err)
  }
}

export const deleteAppointment = async (req, res) => {
  try {
    await service.deleteAppointment(req.params.id)
    res.json({ status: "success" })
  } catch (err) {
    handleError(res, err)
  }
}
