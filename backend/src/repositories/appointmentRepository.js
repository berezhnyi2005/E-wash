
import prisma from '../config/prisma.js'

export const getAll = async () => {
  return await prisma.appointment.findMany()
}

export const getById = async (id) => {
  return await prisma.appointment.findUnique({
    where: { id: Number(id) }
  })
}

export const create = async (data) => {
  return await prisma.appointment.create({
    data
  })
}

export const update = async (id, data) => {
  return await prisma.appointment.update({
    where: { id: Number(id) },
    data
  })
}

export const remove = async (id) => {
  return await prisma.appointment.delete({
    where: { id: Number(id) }
  })
}
