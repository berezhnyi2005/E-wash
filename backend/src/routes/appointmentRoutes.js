import express from "express";
import {
  getAllAppointments,
  getMyAppointments,
  getBusySlots,
  createAppointment,
  updateStatus,
  deleteAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/", getAllAppointments); // admin
router.get("/my", getMyAppointments); // user
router.get("/busy", getBusySlots);
router.post("/", createAppointment);
router.patch("/:id/status", updateStatus); // admin
router.delete("/:id", deleteAppointment); // admin

export default router;
