import UserRepo from "../repo/user.repo.js";
export default class UserController{
    _UserRepo;
    constructor(){
        this._UserRepo=new UserRepo()
    }
    //Register
    async register(req,res,next){

    }
    //Login
    async login(req,res,next){

    }
    //Logout
    async logout(req,res,next){
        
    }
}