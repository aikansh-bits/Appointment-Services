import express from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import appointmentRoutes from "./routes/appointment.routes.js";

config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => {
    res.send("Appointment Service is running!");
});

export default app;
