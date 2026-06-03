import jwt from "jsonwebtoken";
import UserRepo from "../repo/user.repo.js";
import { APIResponse } from "../utils/api.responce.js";
import { ApiError } from "../utils/api.error.js";

export default class UserController {
  _UserRepo;
  constructor() {
    this._UserRepo = new UserRepo();
  }

  // Register
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json(new ApiError(400, "All fields (name, email, password) are required"));
      }

      // Check if user already exists
      const existingUser = await this._UserRepo.findByEmail(email);
      if (existingUser) {
        return res.status(409).json(new ApiError(409, "User with this email already exists"));
      }

      // Create new user
      const user = await this._UserRepo.create(name, email, password);

      return res.status(201).json(new APIResponse(201, "User registered successfully", {
        id: user._id,
        name: user.name,
        email: user.email
      }));
    } catch (err) {
      console.error("Register Error:", err);
      return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
    }
  }

  // Login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json(new ApiError(400, "Email and password are required"));
      }

      
      const user = await this._UserRepo.findByEmail(email);
      if (!user) {
        return res.status(401).json(new ApiError(401, "Invalid email or password"));
      }
      const isPasswordValid = await this._UserRepo.verifyPassword(user, password);
      if (!isPasswordValid) {
        return res.status(401).json(new ApiError(401, "Invalid email or password"));
      }

    
      const token = jwt.sign(
        { UserID: user._id, email: user.email },
        process.env.ACCESSTOKEN_KEY,
        { expiresIn: "1d" }
      );

      // Set cookie
      res.cookie("jwtToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      return res.status(200).json(new APIResponse(200, "Login successful", {
        id: user._id,
        name: user.name,
        email: user.email
      }));
    } catch (err) {
      console.error("Login Error:", err);
      return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
    }
  }

  // Logout
  async logout(req, res, next) {
    try {
      res.clearCookie("jwtToken");
      return res.status(200).json(new APIResponse(200, "Logout successful"));
    } catch (err) {
      console.error("Logout Error:", err);
      return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
    }
  }

  // Get Profile
  async profile(req, res, next) {
    try {
      const userId = req.user.UserID;
      if (!userId) {
        return res.status(401).json(new ApiError(401, "Unauthorized: User payload missing"));
      }

      const user = await this._UserRepo.findById(userId);
      if (!user) {
        return res.status(404).json(new ApiError(404, "User not found"));
      }

      return res.status(200).json(new APIResponse(200, "Profile retrieved successfully", {
        id: user._id,
        name: user.name,
        email: user.email
      }));
    } catch (err) {
      console.error("Profile Error:", err);
      return res.status(500).json(new ApiError(500, err.message || "Internal Server Error"));
    }
  }
}