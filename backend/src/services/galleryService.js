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

/* ======================
   UPDATE ✅ ПРАВИЛЬНЫЙ
====================== */
export const updateGalleryItem = async (id, data, files) => {
  const existing = await repo.getById(id)

  if (!existing) {
    throw {
      type: "VALIDATION_ERROR",
      errors: ["GALLERY_ITEM_NOT_FOUND"]
    }
  }

  const updateData = {}

  /* title */
  if (typeof data.title === "string") {
    const t = data.title.trim()
    if (!t) {
      throw {
        type: "VALIDATION_ERROR",
        errors: ["TITLE_REQUIRED"]
      }
    }
    updateData.title = t
  }

  /* serviceId (multipart-safe) */
  if ("serviceId" in data) {
    if (
      data.serviceId === "" ||
      data.serviceId === "null" ||
      data.serviceId === null
    ) {
      updateData.serviceId = null
    } else {
      const sid = Number(data.serviceId)
      if (Number.isNaN(sid)) {
        throw {
          type: "VALIDATION_ERROR",
          errors: ["SERVICE_ID_INVALID"]
        }
      }

      const service = await prisma.service.findUnique({
        where: { id: sid }
      })

      if (!service) {
        throw {
          type: "VALIDATION_ERROR",
          errors: ["SERVICE_NOT_FOUND"]
        }
      }

      updateData.serviceId = sid
    }
  }

  /* files — если не пришли, старые остаются */
  if (files?.before?.[0]) {
    updateData.beforeUrl = `/uploads/gallery/${files.before[0].filename}`
  }

  if (files?.after?.[0]) {
    updateData.afterUrl = `/uploads/gallery/${files.after[0].filename}`
  }

  return repo.update(id, updateData)
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
