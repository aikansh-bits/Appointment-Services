import Appointment from "../models/appointment.model.js";
import axios from "axios";

const userServiceURL = process.env.USER_SERVICE_URL;
const doctorServiceURL = process.env.DOCTOR_SERVICE_URL;
const notificationServiceURL = process.env.NOTIFICATION_SERVICE_URL;

// Create a new appointment

export async function createAppointment(req, res) {
  try {
    const { patientID, doctorID, date } = req.body;

    console.log("📥 Incoming Appointment Request Body:", req.body);
    console.log("🔗 USER_SERVICE_URL:", userServiceURL);
    console.log("🔗 DOCTOR_SERVICE_URL:", doctorServiceURL);
    console.log("🔗 NOTIFICATION_SERVICE_URL:", notificationServiceURL);

    // 1. Fetch user info
    let userData = {};
    const userURL = `${userServiceURL}/api/users/getUser/${patientID}`;
    try {
      console.log(`📡 Fetching user info from: ${userURL}`);
      const userResponse = await axios.get(userURL);
      userData = userResponse.data;
      console.log("✅ User data received:", userData);
    } catch (err) {
      console.warn("⚠️ User fetch failed:", err.message);
    }

    // 2. Fetch doctor info
    let doctorData = {};
    const doctorURL = `${doctorServiceURL}/api/doctors/${doctorID}`;
    try {
      console.log(`📡 Fetching doctor info from: ${doctorURL}`);
      const doctorResponse = await axios.get(doctorURL);
      doctorData = doctorResponse.data;
      console.log("✅ Doctor data received:", doctorData);
    } catch (err) {
      console.warn("⚠️ Doctor fetch failed:", err.message);
    }

    // 3. Generate appointment ID
    const lastAppointment = await Appointment.findOne().sort({
      appointmentID: -1,
    });
    const nextAppointmentID = lastAppointment
      ? lastAppointment.appointmentID + 1
      : 100;
    console.log(`🆔 New Appointment ID: ${nextAppointmentID}`);

    const newAppointment = new Appointment({
      ...req.body,
      appointmentID: nextAppointmentID,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newAppointment.save();
    console.log("💾 Appointment saved to database:", newAppointment);

    // 4. Send Notification
    if (userData?.email && doctorData?.name) {
      try {
        const message = `
        Dear ${userData.name},
        
        Your appointment has been successfully confirmed. Here are the details:  
        Date: ${new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
        Time: ${new Date(date).toLocaleTimeString()}
        Doctor: ${doctorData.name} (${doctorData.specialization})
        
        If you have any questions or need to reschedule, please contact our office.
        Thank you for choosing our clinic. We look forward to seeing you!
        Best regards,
        Healthcare Appointment Service
        `;

        const notifyURL = `${notificationServiceURL}/api/Notification/send`;
        console.log(
          `📨 Sending notification to ${userData.email} via ${notifyURL}`
        );
        await axios.post(notifyURL, {
          recipient: userData.email,
          message: message.trim(),
          type: 0,
        });

        console.log("✅ Notification sent successfully.");
      } catch (err) {
        console.error("❌ Notification failed:", err.message);
      }
    } else {
      console.warn(
        "⚠️ Notification skipped: Missing user email or doctor name."
      );
    }

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("❌ Error during appointment creation:", error.message);
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
    const appointment = await Appointment.findOne({
      appointmentID: req.params.id,
    });
    if (!appointment)
      return res.status(404).json({ error: "Appointment not found" });
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
    if (!updated)
      return res.status(404).json({ error: "Appointment not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Delete appointment
export async function deleteAppointment(req, res) {
  try {
    const deleted = await Appointment.findOneAndDelete({
      appointmentID: req.params.id,
    });
    if (!deleted)
      return res.status(404).json({ error: "Appointment not found" });
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
