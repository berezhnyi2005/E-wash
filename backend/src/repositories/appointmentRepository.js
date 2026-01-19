import prisma from "../config/prisma.js"

export const getAll = async () => {
  return prisma.appointment.findMany({
    include: {
      user: true,
      service: true
    },
    orderBy: {
      dateTime: "asc"
    }
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
    include: {
      service: true
    },
    orderBy: {
      dateTime: "asc"
    }
  })
}

export const getByDateTimeAndService = async (serviceId, dateTime) => {
  return prisma.appointment.findFirst({
    where: {
      serviceId: Number(serviceId),
      dateTime: new Date(dateTime)
    }
  })
}

export const create = async (data) => {
  return prisma.appointment.create({
    data
  })
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
