import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouts from "./src/routers/user.routs.js";
import dotenv from "dotenv";
dotenv.config();


let server=express();

server.use(express.json())//Postman
server.use(express.urlencoded({ extended: true }));//Data comming from HTML/React forms
server.use(cookieParser())

server.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));




server.use("/api/user",UserRouts)

export {server}