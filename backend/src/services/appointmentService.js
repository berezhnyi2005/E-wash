import * as repo from "../repositories/appointmentRepository.js"

export const getAllAppointments = async () => {
  return repo.getAll()
}

export const getMyAppointments = async (userId) => {
  return repo.getByUserId(userId)
}

export const getBusySlotsByDate = async (date) => {
  const appointments = await repo.getByDate(date)

  return appointments.map(a => ({
    dateTime: a.dateTime,
    durationMin: a.service.durationMin
  }))
}

export const createAppointment = async ({ userId, serviceId, dateTime, notes }) => {
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
