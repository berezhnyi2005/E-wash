import express from "express"
import {
  getAllAppointments,
  getMyAppointments,
  getBusySlots,
  createAppointment,
  updateStatus,
  deleteAppointment
} from "../controllers/appointmentController.js"

const router = express.Router()

router.get("/", getAllAppointments)
router.get("/my", getMyAppointments)
router.get("/busy", getBusySlots)
router.post("/", createAppointment)
router.patch("/:id/status", updateStatus)
router.delete("/:id", deleteAppointment)

export default router
