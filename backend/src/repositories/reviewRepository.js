import prisma from '../config/prisma.js'

export const getAll = async () => {
  return await prisma.review.findMany()
}

export const getById = async (id) => {
  return await prisma.review.findUnique({
    where: { id: Number(id) }
  })
}

export const create = async (data) => {
  return await prisma.review.create({
    data
  })
}

export const update = async (id, data) => {
  return await prisma.review.update({
    where: { id: Number(id) },
    data
  })
}

export const remove = async (id) => {
  return await prisma.review.delete({
    where: { id: Number(id) }
  })
}
