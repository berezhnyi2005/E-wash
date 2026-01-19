import * as repo from "../repositories/appointmentRepository.js"

export const getAllAppointments = async () => {
  return repo.getAll()
}

export const getMyAppointments = async (userId) => {
  return repo.getByUserId(userId)
}

export const createAppointment = async ({ userId, serviceId, dateTime, notes }) => {
  const existing = await repo.getByDateTimeAndService(serviceId, dateTime)
  if (existing) {
    throw new Error("Selected time is already booked")
  }

  return repo.create({
    userId,
    serviceId,
    dateTime: new Date(dateTime),
    status: "PENDING",
    notes
  })
}

export const changeStatus = async (id, status) => {
  const allowed = ["PENDING", "APPROVED", "CANCELLED"]
  if (!allowed.includes(status)) {
    throw new Error("Invalid status")
  }

  return repo.updateStatus(id, status)
}

export const deleteAppointment = async (id) => {
  return repo.remove(id)
}
