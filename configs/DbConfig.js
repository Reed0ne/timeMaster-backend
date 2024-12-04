import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  try {
    const dbURI = process.env.DB_URL;
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB conectado com sucesso");
  } catch (error) {
    console.error("Erro ao conectar com MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
