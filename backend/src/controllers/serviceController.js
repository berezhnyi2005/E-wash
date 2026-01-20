import * as service from "../services/serviceService.js"

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

export const getAllServices = async (req, res) => {
  try {
    const data = await service.getAllServices()
    res.json({ status: "success", data })
  } catch (err) {
    handleError(res, err)
  }
}

export const getServiceById = async (req, res) => {
  try {
    const errors = []
    const { id } = req.params

    if (!id) errors.push("MISSING_SERVICE_ID")
    if (id && isNaN(Number(id))) errors.push("INVALID_SERVICE_ID")

    if (errors.length) {
      throw { type: "VALIDATION_ERROR", errors }
    }

    const data = await service.getServiceById(Number(id))
    res.json({ status: "success", data })
  } catch (err) {
    handleError(res, err)
  }
}

export const createService = async (req, res) => {
  try {
    const errors = []
    const { title, description, price, durationMin } = req.body

    const trimmedTitle = (title || "").trim()
    const trimmedDescription = (description || "").trim()

    if (!trimmedTitle) errors.push("MISSING_TITLE")
    if (trimmedTitle && trimmedTitle.length < 3) errors.push("TITLE_TOO_SHORT")

    if (!trimmedDescription) errors.push("MISSING_DESCRIPTION")
    if (trimmedDescription && trimmedDescription.length < 5) {
      errors.push("DESCRIPTION_TOO_SHORT")
    }

    if (price == null) errors.push("MISSING_PRICE")
    if (price != null && (isNaN(Number(price)) || Number(price) <= 0)) {
      errors.push("INVALID_PRICE")
    }

    if (durationMin == null) errors.push("MISSING_DURATION")
    if (
      durationMin != null &&
      (isNaN(Number(durationMin)) || Number(durationMin) <= 0)
    ) {
      errors.push("INVALID_DURATION")
    }

    if (errors.length) {
      throw { type: "VALIDATION_ERROR", errors }
    }

    const data = await service.createService({
      title: trimmedTitle,
      description: trimmedDescription,
      price: Number(price),
      durationMin: Number(durationMin)
    })

    res.status(201).json({ status: "success", data })
  } catch (err) {
    handleError(res, err)
  }
}

export const updateService = async (req, res) => {
  try {
    const errors = []
    const { id } = req.params
    const { title, description, price, durationMin } = req.body

    const trimmedTitle = (title || "").trim()
    const trimmedDescription = (description || "").trim()

    if (!id) errors.push("MISSING_SERVICE_ID")
    if (id && isNaN(Number(id))) errors.push("INVALID_SERVICE_ID")

    if (!trimmedTitle) errors.push("MISSING_TITLE")
    if (trimmedTitle && trimmedTitle.length < 3) errors.push("TITLE_TOO_SHORT")

    if (!trimmedDescription) errors.push("MISSING_DESCRIPTION")
    if (trimmedDescription && trimmedDescription.length < 5) {
      errors.push("DESCRIPTION_TOO_SHORT")
    }

    if (price == null) errors.push("MISSING_PRICE")
    if (price != null && (isNaN(Number(price)) || Number(price) <= 0)) {
      errors.push("INVALID_PRICE")
    }

    if (durationMin == null) errors.push("MISSING_DURATION")
    if (
      durationMin != null &&
      (isNaN(Number(durationMin)) || Number(durationMin) <= 0)
    ) {
      errors.push("INVALID_DURATION")
    }

    if (errors.length) {
      throw { type: "VALIDATION_ERROR", errors }
    }

    const data = await service.updateService(Number(id), {
      title: trimmedTitle,
      description: trimmedDescription,
      price: Number(price),
      durationMin: Number(durationMin)
    })

    res.json({ status: "success", data })
  } catch (err) {
    handleError(res, err)
  }
}

export const deleteService = async (req, res) => {
  try {
    const errors = []
    const { id } = req.params

    if (!id) errors.push("MISSING_SERVICE_ID")
    if (id && isNaN(Number(id))) errors.push("INVALID_SERVICE_ID")

    if (errors.length) {
      throw { type: "VALIDATION_ERROR", errors }
    }

    await service.deleteService(Number(id))
    res.json({ status: "success" })
  } catch (err) {
    handleError(res, err)
  }
}
