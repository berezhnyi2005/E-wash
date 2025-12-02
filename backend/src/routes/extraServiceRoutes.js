import express from 'express'
import {
  getAllExtraServices,
  getExtraServiceById,
  createExtraService,
  updateExtraService,
  deleteExtraService
} from '../controllers/extraServiceController.js'

const router = express.Router()

router.get('/', getAllExtraServices)
router.get('/:id', getExtraServiceById)
router.post('/', createExtraService)
router.put('/:id', updateExtraService)
router.delete('/:id', deleteExtraService)

export default router
