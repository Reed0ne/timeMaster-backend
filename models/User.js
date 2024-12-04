import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  senha: String,
});

const Usuario = mongoose.model("Usuario", userSchema);

export default Usuario;
