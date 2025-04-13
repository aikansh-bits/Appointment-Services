import { Router } from "express";
import {
    createAppointment,
    getAllAppointments,
    getAppointmentByID,
    updateAppointment,
    deleteAppointment
} from "../controllers/appointment.controller.js";

const router = Router();

router.post("/bookAppointment", createAppointment);
router.get("/getAllAppointments", getAllAppointments);
router.get("/getAppointment/:id", getAppointmentByID);
router.put("/updateAppointment/:id", updateAppointment);
router.delete("/cancelAppointment/:id", deleteAppointment);

export default router;
