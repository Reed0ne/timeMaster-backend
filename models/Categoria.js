import mongoose from "mongoose";

const categoriaSchema = new mongoose.Schema({
  name: String,
  descricao: String,
  cor: String,
});

const Categoria = mongoose.model("Categoria", categoriaSchema);

export default Categoria;
