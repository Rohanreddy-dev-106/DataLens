import express from"express"
import UserController from "../controllers/user.controller.js";
import jwtAuth from "../../middlewares/Auth.js";
import Userfile from "../../middlewares/multer.js";

const UserRouts=express.Router();

const user=new UserController();

UserRouts.post("/register",(req,res,next)=>{
    user.register(req,res,next)
})
UserRouts.post("/login", (req, res, next) => {
    user.login(req, res, next)
})
UserRouts.post("/logout", (req, res, next) => {
    user.logout(req, res, next)
})
UserRouts.get("/profile", jwtAuth, (req, res, next) => {
    user.profile(req, res, next)
})
UserRouts.post("/analysis", Userfile.single("file"), (req, res, next) => {
    user.analysis(req, res, next)
})

export default UserRouts;