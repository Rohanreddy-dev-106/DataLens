import mongoose, { Schema } from "mongoose";
const usersSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email"
        ]
    },

    password: {
        type: String,
        required: true,
        match: [
            /^.{6,}$/,
            "Password must be at least 6 characters"
        ]
    }

},
    { timestamps: true }
);

export default mongoose.model("User", usersSchema);

