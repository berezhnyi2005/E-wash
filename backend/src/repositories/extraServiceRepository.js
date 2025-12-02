import prisma from '../config/prisma.js'

export const getAll = async () => {
  return await prisma.extraService.findMany()
}

export const getById = async (id) => {
  return await prisma.extraService.findUnique({
    where: { id: Number(id) }
  })
}

export const create = async (data) => {
  return await prisma.extraService.create({
    data
  })
}

export const update = async (id, data) => {
  return await prisma.extraService.update({
    where: { id: Number(id) },
    data
  })
}

export const remove = async (id) => {
  return await prisma.extraService.delete({
    where: { id: Number(id) }
  })
}
