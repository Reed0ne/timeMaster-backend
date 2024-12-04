import mongoose from "mongoose";

const atividadeSchema = new mongoose.Schema({
  name: String,
  isPommodoro: Boolean,
  cor: String,
  concluida: Boolean,
  momentoConclusao: { type: String, default: null },
  inicioAtividade: String,
  fimAtividade: String,
  id_categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
  },
});

const Atividade = mongoose.model("Atividade", atividadeSchema);

export default Atividade;
