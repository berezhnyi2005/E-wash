import * as repo from '../repositories/appointmentRepository.js'

export const getAllAppointments = async () => {
  return await repo.getAll()
}

export const getAppointmentById = async (id) => {
  const appointment = await repo.getById(id)
  if (!appointment) throw new Error('Appointment not found')
  return appointment
}

export const createAppointment = async (data) => {
  return await repo.create(data)
}

export const updateAppointment = async (id, data) => {
  const existing = await repo.getById(id)
  if (!existing) throw new Error('Appointment not found')

  return await repo.update(id, data)
}

export const deleteAppointment = async (id) => {
  const existing = await repo.getById(id)
  if (!existing) throw new Error('Appointment not found')

  await repo.remove(id)
  return true
}
