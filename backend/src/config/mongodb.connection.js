import mongoose from "mongoose";

async function MongoDBconnection() {
    const MONGO_URI = process.env.MONGODB_CONNECTION_STRING;
    if (!MONGO_URI) {
        throw new Error("MONGO_URI is not defined in environment variables");
    }
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected.");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error; // let the app crash-fast instead of booting with no DB
    }
}

export { MongoDBconnection };