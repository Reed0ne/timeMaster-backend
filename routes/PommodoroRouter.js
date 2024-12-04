import express from "express";
import Pommodoro from "../models/Pommodoro.js";
import mongoose from "mongoose";

const pommodoroRouter = express.Router();

pommodoroRouter.get("/", async (req, res) => {
  try {
    const data = await Pommodoro.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro na busca" });
  }
});

pommodoroRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Pommodoro.findById(id);

    if (!data) {
      return res.status(404).json({ error: "Pommodoro não encontrado!" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro na busca" });
  }
});

pommodoroRouter.post("/", async (req, res) => {
  try {
    const data = new Pommodoro(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar data" });
  }
});

pommodoroRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const data = await Pommodoro.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!data) {
      return res.status(404).json({ error: "pommodoro não encontrado" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o pommodoro" });
  }
});

pommodoroRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const pommodoroDeletado = await Pommodoro.findByIdAndDelete(id);
    if (!pommodoroDeletado) {
      return res.status(404).json({ error: "Pommodoro não encontrado" });
    }

    res.status(200).json({ message: "Pommodoro deletado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar Pommodoro" });
  }
});

export default pommodoroRouter;
