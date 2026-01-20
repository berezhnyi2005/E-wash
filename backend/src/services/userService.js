import * as repo from '../repositories/userRepository.js'
import prisma from '../config/prisma.js'

export const getAllUsers = async () => {
  return repo.getAll()
}

export const getUserById = async (id) => {
  const uid = Number(id)

  if (!Number.isFinite(uid) || uid <= 0) {
    throw {
      type: 'VALIDATION_ERROR',
      errors: ['INVALID_USER_ID']
    }
  }

  const user = await repo.getById(uid)

  if (!user) {
    throw {
      type: 'VALIDATION_ERROR',
      errors: ['USER_NOT_FOUND']
    }
  }

  return user
}

export const createUser = async ({
  name,
  email,
  passwordHash,
  role
}) => {
  const errors = []

  const n = String(name || '').trim()
  if (!n || n.length < 2) {
    errors.push('NAME_TOO_SHORT')
  }

  const e = String(email || '').trim().toLowerCase()
  if (!e || !e.includes('@')) {
    errors.push('INVALID_EMAIL')
  }

  if (!passwordHash) {
    errors.push('PASSWORD_REQUIRED')
  }

  const r = role || 'USER'
  if (!['USER', 'ADMIN'].includes(r)) {
    errors.push('INVALID_ROLE')
  }

  const exists = e
    ? await prisma.user.findUnique({ where: { email: e } })
    : null

  if (exists) {
    errors.push('EMAIL_ALREADY_EXISTS')
  }

  if (errors.length) {
    throw {
      type: 'VALIDATION_ERROR',
      errors
    }
  }

  return repo.create({
    name: n,
    email: e,
    passwordHash,
    role: r
  })
}

export const updateUser = async (id, data) => {
  const uid = Number(id)

  if (!Number.isFinite(uid) || uid <= 0) {
    throw {
      type: 'VALIDATION_ERROR',
      errors: ['INVALID_USER_ID']
    }
  }

  const existing = await repo.getById(uid)

  if (!existing) {
    throw {
      type: 'VALIDATION_ERROR',
      errors: ['USER_NOT_FOUND']
    }
  }

  const errors = []
  const updateData = {}

  if ('name' in data) {
    const n = String(data.name || '').trim()
    if (!n || n.length < 2) {
      errors.push('NAME_TOO_SHORT')
    } else {
      updateData.name = n
    }
  }

  if ('email' in data) {
    const e = String(data.email || '').trim().toLowerCase()
    if (!e || !e.includes('@')) {
      errors.push('INVALID_EMAIL')
    } else {
      const exists = await prisma.user.findUnique({ where: { email: e } })
      if (exists && exists.id !== uid) {
        errors.push('EMAIL_ALREADY_EXISTS')
      } else {
        updateData.email = e
      }
    }
  }

  if ('role' in data) {
    if (!['USER', 'ADMIN'].includes(data.role)) {
      errors.push('INVALID_ROLE')
    } else {
      updateData.role = data.role
    }
  }

  if (errors.length) {
    throw {
      type: 'VALIDATION_ERROR',
      errors
    }
  }

  return repo.update(uid, updateData)
}

export const deleteUser = async (id) => {
  const uid = Number(id)

  if (!Number.isFinite(uid) || uid <= 0) {
    throw {
      type: 'VALIDATION_ERROR',
      errors: ['INVALID_USER_ID']
    }
  }

  const existing = await repo.getById(uid)

  if (!existing) {
    throw {
      type: 'VALIDATION_ERROR',
      errors: ['USER_NOT_FOUND']
    }
  }

  return repo.remove(uid)
}
