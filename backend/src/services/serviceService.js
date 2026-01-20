import * as repo from '../repositories/serviceRepository.js'

export const getAllServices = async () => {
  return repo.getAll()
}

export const getServiceById = async (id) => {
  const service = await repo.getById(id)

  if (!service) {
    throw {
      type: 'VALIDATION_ERROR',
      errors: ['SERVICE_NOT_FOUND']
    }
  }

  return service
}

export const createService = async ({
  title,
  description,
  price,
  durationMin
}) => {
  const errors = []

  const t = String(title || '').trim()
  if (!t || t.length < 3) {
    errors.push('TITLE_TOO_SHORT')
  }

  const d = String(description || '').trim()
  if (!d || d.length < 5) {
    errors.push('DESCRIPTION_TOO_SHORT')
  }

  const p = Number(price)
  if (!Number.isFinite(p) || p <= 0) {
    errors.push('INVALID_PRICE')
  }

  const dur = Number(durationMin)
  if (!Number.isFinite(dur) || dur <= 0) {
    errors.push('INVALID_DURATION')
  }

  if (errors.length) {
    throw {
      type: 'VALIDATION_ERROR',
      errors
    }
  }

  return repo.create({
    title: t,
    description: d,
    price: p,
    durationMin: dur
  })
}

export const updateService = async (id, {
  title,
  description,
  price,
  durationMin
}) => {
  const existing = await repo.getById(id)

  if (!existing) {
    throw {
      type: 'VALIDATION_ERROR',
      errors: ['SERVICE_NOT_FOUND']
    }
  }

  const errors = []
  const updateData = {}

  if (title !== undefined) {
    const t = String(title || '').trim()
    if (!t || t.length < 3) {
      errors.push('TITLE_TOO_SHORT')
    } else {
      updateData.title = t
    }
  }

  if (description !== undefined) {
    const d = String(description || '').trim()
    if (!d || d.length < 5) {
      errors.push('DESCRIPTION_TOO_SHORT')
    } else {
      updateData.description = d
    }
  }

  if (price !== undefined) {
    const p = Number(price)
    if (!Number.isFinite(p) || p <= 0) {
      errors.push('INVALID_PRICE')
    } else {
      updateData.price = p
    }
  }

  if (durationMin !== undefined) {
    const dur = Number(durationMin)
    if (!Number.isFinite(dur) || dur <= 0) {
      errors.push('INVALID_DURATION')
    } else {
      updateData.durationMin = dur
    }
  }

  if (errors.length) {
    throw {
      type: 'VALIDATION_ERROR',
      errors
    }
  }

  return repo.update(id, updateData)
}

export const deleteService = async (id) => {
  const existing = await repo.getById(id)

  if (!existing) {
    throw {
      type: 'VALIDATION_ERROR',
      errors: ['SERVICE_NOT_FOUND']
    }
  }

  await repo.remove(id)
  return true
}
