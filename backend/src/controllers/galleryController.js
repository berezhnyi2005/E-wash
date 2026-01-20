import * as service from "../services/galleryService.js"

const handleError = (res, err) => {
  if (err?.type === "VALIDATION_ERROR") {
    return res.status(400).json({
      status: "error",
      errors: err.errors
    })
  }

  return res.status(500).json({
    status: "error",
    message: err.message || "Internal server error"
  })
}

export const getAllGalleryItems = async (req, res) => {
  try {
    const data = await service.getAllGalleryItems()
    res.json({ status: "success", data })
  } catch (err) {
    handleError(res, err)
  }
}

export const getGalleryItem = async (req, res) => {
  try {
    const errors = []
    const { id } = req.params

    if (!id) errors.push("MISSING_GALLERY_ID")
    if (id && isNaN(Number(id))) errors.push("INVALID_GALLERY_ID")

    if (errors.length) {
      throw { type: "VALIDATION_ERROR", errors }
    }

    const data = await service.getGalleryItemById(Number(id))
    res.json({ status: "success", data })
  } catch (err) {
    handleError(res, err)
  }
}

export const createGalleryItem = async (req, res) => {
  try {
    const errors = []
    const { title, serviceId } = req.body

    const before = req.files?.before?.[0]
    const after = req.files?.after?.[0]

    if (!title || !title.trim()) errors.push("MISSING_TITLE")
    if (!before) errors.push("MISSING_BEFORE_IMAGE")
    if (!after) errors.push("MISSING_AFTER_IMAGE")

    if (serviceId && isNaN(Number(serviceId))) {
      errors.push("INVALID_SERVICE_ID")
    }

    if (errors.length) {
      throw { type: "VALIDATION_ERROR", errors }
    }

    const data = await service.createGalleryItem({
      title: title.trim(),
      serviceId: serviceId ? Number(serviceId) : null,
      beforeUrl: `/uploads/gallery/${before.filename}`,
      afterUrl: `/uploads/gallery/${after.filename}`
    })

    res.status(201).json({ status: "success", data })
  } catch (err) {
    handleError(res, err)
  }
}

export const updateGalleryItem = async (req, res) => {
  try {
    const errors = []
    const { id } = req.params
    const { title, serviceId } = req.body

    if (!id) errors.push("MISSING_GALLERY_ID")
    if (id && isNaN(Number(id))) errors.push("INVALID_GALLERY_ID")

    if (title !== undefined && !title.trim()) {
      errors.push("INVALID_TITLE")
    }

    if (serviceId !== undefined && serviceId !== null && isNaN(Number(serviceId))) {
      errors.push("INVALID_SERVICE_ID")
    }

    if (errors.length) {
      throw { type: "VALIDATION_ERROR", errors }
    }

    const data = await service.updateGalleryItem(
      Number(id),
      req.body,
      req.files
    )

    res.json({ status: "success", data })
  } catch (err) {
    handleError(res, err)
  }
}

export const deleteGalleryItem = async (req, res) => {
  try {
    const errors = []
    const { id } = req.params

    if (!id) errors.push("MISSING_GALLERY_ID")
    if (id && isNaN(Number(id))) errors.push("INVALID_GALLERY_ID")

    if (errors.length) {
      throw { type: "VALIDATION_ERROR", errors }
    }

    await service.deleteGalleryItem(Number(id))
    res.json({ status: "success" })
  } catch (err) {
    handleError(res, err)
  }
}
