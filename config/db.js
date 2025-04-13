import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "appointment_services"
        });
        console.log("Connected to:", mongoose.connection.name);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error", err);
        process.exit(1);
    }
};

export default connectDB;
