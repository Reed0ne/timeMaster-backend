import mongoose from "mongoose";

const pommodoroSchema = new mongoose.Schema({
  tempoAtividade: Number,
  pausaCurta: Number,
  pausaLonga: Number,
  id_atividade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Atividade",
  },
});

const Pommodoro = mongoose.model("Pommodoro", pommodoroSchema);

export default Pommodoro;
