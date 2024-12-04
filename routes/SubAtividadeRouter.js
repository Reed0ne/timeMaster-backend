import express from "express";
import SubAtividade from "../models/SubAtividade.js";
import mongoose from "mongoose";

const subAtividadeRouter = express.Router();

subAtividadeRouter.get("/", async (req, res) => {
  try {
    const data = await SubAtividade.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro na busca" });
  }
});

subAtividadeRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await SubAtividade.findById(id);

    if (!data) {
      return res.status(404).json({ error: "SubAtividade não encontrado!" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro na busca" });
  }
});

subAtividadeRouter.post("/", async (req, res) => {
  try {
    const data = new SubAtividade(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar data" });
  }
});

subAtividadeRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const data = await SubAtividade.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!data) {
      return res.status(404).json({ error: "subAtividade não encontrado" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o subAtividade" });
  }
});

subAtividadeRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const subAtividadeDeletado = await SubAtividade.findByIdAndDelete(id);
    if (!subAtividadeDeletado) {
      return res.status(404).json({ error: "SubAtividade não encontrado" });
    }

    res.status(200).json({ message: "SubAtividade deletado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar SubAtividade" });
  }
});

export default subAtividadeRouter;
