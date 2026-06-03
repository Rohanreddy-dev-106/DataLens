import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";

export default class UserRepo {
  async create(name, email, password) {
    const hashedPassword = await bcrypt.hash(password,12);
    const user = new UserModel({
      name,
      email,
      password: hashedPassword
    });
    return await user.save();
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email });
  }

  async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  async findById(id) {
    return await UserModel.findById(id);
  }
}