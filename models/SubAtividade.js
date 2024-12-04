import mongoose from "mongoose";

const subAtividadeSchema = new mongoose.Schema({
  name: String,
  cor: String,
  concluida: Boolean,
  id_atividade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Atividade",
  },
});

const SubAtividade = mongoose.model("SubAtividade", subAtividadeSchema);

export default SubAtividade;
