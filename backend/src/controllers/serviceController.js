import * as service from '../services/serviceService.js'

export const getAllServices = async (req, res) => {
  try {
    const result = await service.getAllServices()
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}
export const getServiceById = async (req, res) => {
  try {
    const result = await service.getServiceById(req.params.id)
    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}
export const createService = async (req, res) => {
  try {
    const { title, description, price, durationMin } = req.body
    const trimmedTitle = (title || "").trim()
      if (!trimmedTitle || trimmedTitle.length < 3) {
      return res.status(400).json({
        status: 'error',
        message: 'Názov musí mať aspoň 3 znaky.'
      })
    }
    const trimmedDescription = (description || "").trim()
    if (!trimmedDescription || trimmedDescription.length < 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Popis musí mať aspoň 5 znakov.'
      })
    }
     if (price == null || Number(price) <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cena musí byť väčšia ako 0.'
      })
    }
    if (durationMin == null || Number(durationMin) <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Trvanie musí byť väčšie ako 0.'
      })
    }
    const result = await service.createService({
      title: trimmedTitle,
      description: trimmedDescription,
      price: Number(price),
      durationMin: Number(durationMin)
    })
    res.status(201).json({ status: 'success', data: result })

  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message })
  }
}
export const updateService = async (req, res) => {
  try {
    const { title, description, price, durationMin } = req.body
    const trimmedTitle = (title || "").trim()
    if (!trimmedTitle || trimmedTitle.length < 3) {
      return res.status(400).json({
        status: 'error',
        message: 'Názov musí mať aspoň 3 znaky.'
      })
    }
    const trimmedDescription = (description || "").trim()
    if (!trimmedDescription || trimmedDescription.length < 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Popis musí mať aspoň 5 znakov.'
      })
    }

    if (price == null || Number(price) <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cena musí byť väčšia ako 0.'
      })
    }

    if (durationMin == null || Number(durationMin) <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Trvanie musí byť väčšie ako 0.'
      })
    }

    const result = await service.updateService(req.params.id, {
      title: trimmedTitle,
      description: trimmedDescription,
      price: Number(price),
      durationMin: Number(durationMin)
    })

    res.json({ status: 'success', data: result })

  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}

export const deleteService = async (req, res) => {
  try {
    await service.deleteService(req.params.id)
    res.json({ status: 'success', message: 'Service deleted' })
  } catch (err) {
    res.status(404).json({ status: 'error', message: err.message })
  }
}
