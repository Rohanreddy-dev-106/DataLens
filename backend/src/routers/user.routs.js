import express from"express"
import UserController from "../controllers/user.controller.js";
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

export default UserRouts;