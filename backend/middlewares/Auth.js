import jwt from "jsonwebtoken";
import { ApiError } from "../src/utils/api.error.js";

export default function jwtAuth(req, res, next) {
    const token = req.cookies.jwtToken;

    if (!token) {
        return res.status(401).json(new ApiError(401, "Access denied: No token provided"));
    }

    try {
        const payload = jwt.verify(token, process.env.ACCESSTOKEN_KEY);

        // Attach all user info to req object
        req.user = {
            UserID: payload.UserID,
            email: payload.email,
            role: payload.role
        };

        next();
    } catch (error) {
        return res.status(401).json(new ApiError(401, "Invalid token or credentials"));
    }
}