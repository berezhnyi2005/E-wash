import prisma from "../config/prisma.js"

export const getAll = async () => {
  return prisma.appointment.findMany({
    include: {
      user: true,
      service: true
    },
    orderBy: { dateTime: "asc" }
  })
}

export const getById = async (id) => {
  return prisma.appointment.findUnique({
    where: { id: Number(id) },
    include: {
      user: true,
      service: true
    }
  })
}

export const getByUserId = async (userId) => {
  return prisma.appointment.findMany({
    where: { userId: Number(userId) },
    include: { service: true },
    orderBy: { dateTime: "asc" }
  })
}

export const getByDate = async (date) => {
  const startOfDay = new Date(`${date}T00:00:00`)
  const endOfDay = new Date(`${date}T23:59:59.999`)

  return prisma.appointment.findMany({
    where: {
      dateTime: {
        gte: startOfDay,
        lte: endOfDay
      }
    },
    include: {
      service: true
    }
  })
}

export const create = async (data) => {
  return prisma.appointment.create({ data })
}

export const updateStatus = async (id, status) => {
  return prisma.appointment.update({
    where: { id: Number(id) },
    data: { status }
  })
}

export const remove = async (id) => {
  return prisma.appointment.delete({
    where: { id: Number(id) }
  })
}
