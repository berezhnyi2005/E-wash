import * as repo from "../repositories/galleryRepository.js"
import prisma from "../config/prisma.js"

export const getAllGalleryItems = async () => {
  return repo.getAll()
}

export const getGalleryItemById = async (id) => {
  const item = await repo.getById(id)

  if (!item) {
    throw {
      type: "VALIDATION_ERROR",
      errors: ["GALLERY_ITEM_NOT_FOUND"]
    }
  }

  return item
}

export const createGalleryItem = async ({
  title,
  beforeUrl,
  afterUrl,
  serviceId
}) => {
  const errors = []

  if (!title || !beforeUrl || !afterUrl) {
    errors.push("MISSING_FIELDS")
  }

  if (serviceId) {
    const service = await prisma.service.findUnique({
      where: { id: Number(serviceId) }
    })

    if (!service) {
      errors.push("SERVICE_NOT_FOUND")
    }
  }

  if (errors.length) {
    throw {
      type: "VALIDATION_ERROR",
      errors
    }
  }

  return repo.create({
    title,
    beforeUrl,
    afterUrl,
    serviceId: serviceId ? Number(serviceId) : null
  })
}

export const updateGalleryItem = async (id, data) => {
  const existing = await repo.getById(id)

  if (!existing) {
    throw {
      type: "VALIDATION_ERROR",
      errors: ["GALLERY_ITEM_NOT_FOUND"]
    }
  }

  return repo.update(id, data)
}

export const deleteGalleryItem = async (id) => {
  const existing = await repo.getById(id)

  if (!existing) {
    throw {
      type: "VALIDATION_ERROR",
      errors: ["GALLERY_ITEM_NOT_FOUND"]
    }
  }

  return repo.remove(id)
}
