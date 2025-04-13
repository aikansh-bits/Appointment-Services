import Appointment from "../models/appointment.model.js";

// Create a new appointment
export async function createAppointment(req, res) {
    try {
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get all appointments
export async function getAllAppointments(req, res) {
    try {
        const appointments = await Appointment.find().sort({ date: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get appointment by ID
export async function getAppointmentByID(req, res) {
    try {
        const appointment = await Appointment.findOne({ appointmentID: req.params.id });
        if (!appointment) return res.status(404).json({ error: "Appointment not found" });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update appointment
export async function updateAppointment(req, res) {
    try {
        const updated = await Appointment.findOneAndUpdate(
            { appointmentID: req.params.id },
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Appointment not found" });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Delete appointment
export async function deleteAppointment(req, res) {
    try {
        const deleted = await Appointment.findOneAndDelete({ appointmentID: req.params.id });
        if (!deleted) return res.status(404).json({ error: "Appointment not found" });
        res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
