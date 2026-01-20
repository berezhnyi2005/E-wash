import prisma from "../config/prisma.js"

export const getAll = async () => {
  return prisma.galleryItem.findMany({
    include: { service: true },
    orderBy: { createdAt: "desc" }
  })
}

export const getById = async (id) => {
  return prisma.galleryItem.findUnique({
    where: { id: Number(id) },
    include: { service: true }
  })
}

export const create = async (data) => {
  return prisma.galleryItem.create({ data })
}

export const update = async (id, data) => {
  return prisma.galleryItem.update({
    where: { id: Number(id) },
    data
  })
}

export const remove = async (id) => {
  return prisma.galleryItem.delete({
    where: { id: Number(id) }
  })
}
