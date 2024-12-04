import express from "express";
import Usuario from "../models/User.js";
import mongoose from "mongoose";

const usuarioRouter = express.Router();

usuarioRouter.get("/", async (req, res) => {
  try {
    const data = await Usuario.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro na busca" });
  }
});

usuarioRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Usuario.findById(id);

    if (!data) {
      return res.status(404).json({ error: "Usuário não encontrado!" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro na busca" });
  }
});

usuarioRouter.post("/", async (req, res) => {
  try {
    const data = new Usuario(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar data" });
  }
});

usuarioRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const data = await Usuario.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!data) {
      return res.status(404).json({ error: "Usuario não encontrado" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o Usuario" });
  }
});

usuarioRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const usuarioDeletado = await Usuario.findByIdAndDelete(id);
    if (!usuarioDeletado) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

export default usuarioRouter;
