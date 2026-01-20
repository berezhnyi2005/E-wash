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

/* ======================
   GET ALL
====================== */
export const getAllGalleryItems = async (req, res) => {
  try {
    const data = await service.getAllGalleryItems()
    res.json({ status: "success", data })
  } catch (err) {
    handleError(res, err)
  }
}

/* ======================
   GET ONE
====================== */
export const getGalleryItem = async (req, res) => {
  try {
    const data = await service.getGalleryItemById(req.params.id)
    res.json({ status: "success", data })
  } catch (err) {
    handleError(res, err)
  }
}

/* ======================
   CREATE
====================== */
export const createGalleryItem = async (req, res) => {
  try {
    const { title, serviceId } = req.body

    const before = req.files?.before?.[0]
    const after = req.files?.after?.[0]

    if (!title || !before || !after) {
      return res.status(400).json({
        status: "error",
        errors: ["MISSING_FIELDS"]
      })
    }

    const data = await service.createGalleryItem({
      title: title.trim(),
      serviceId: serviceId ? Number(serviceId) : null,
      beforeUrl: `/uploads/gallery/${before.filename}`,
      afterUrl: `/uploads/gallery/${after.filename}`
    })

    res.status(201).json({
      status: "success",
      data
    })
  } catch (err) {
    handleError(res, err)
  }
}

/* ======================
   UPDATE
====================== */
export const updateGalleryItem = async (req, res) => {
  try {
    const data = await service.updateGalleryItem(
      req.params.id,
      req.body
    )
    res.json({ status: "success", data })
  } catch (err) {
    handleError(res, err)
  }
}

/* ======================
   DELETE
====================== */
export const deleteGalleryItem = async (req, res) => {
  try {
    await service.deleteGalleryItem(req.params.id)
    res.json({ status: "success" })
  } catch (err) {
    handleError(res, err)
  }
}
