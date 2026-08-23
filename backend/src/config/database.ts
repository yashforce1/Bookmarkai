import mongoose from "mongoose"

const connectDB = async () : Promise<void> =>{
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("MONGODB_URI is not configured.");
    }

    try {
        await mongoose.connect(uri);
        console.log(`✓ MongoDB connected successfully (${mongoose.connection.host})`);
    } catch (error) {
        console.error("✗ MongoDB connection failed:", error);
        throw error;
    }
}

export default connectDB;
