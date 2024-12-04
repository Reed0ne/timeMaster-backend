import express from "express";
import Categoria from "../models/Categoria.js";
import mongoose from "mongoose";

const categoriaRouter = express.Router();

categoriaRouter.get("/", async (req, res) => {
  try {
    const data = await Categoria.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro na busca" });
  }
});

categoriaRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Categoria.findById(id);

    if (!data) {
      return res.status(404).json({ error: "Categoria não encontrada!" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro na busca" });
  }
});

categoriaRouter.post("/", async (req, res) => {
  try {
    const data = new Categoria(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar data" });
  }
});

categoriaRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const data = await Categoria.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!data) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o Categoria" });
  }
});

categoriaRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const usuarioDeletado = await Categoria.findByIdAndDelete(id);
    if (!usuarioDeletado) {
      return res.status(404).json({ error: "Categoria não encontrado" });
    }

    res.status(200).json({ message: "Categoria deletado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar Categoria" });
  }
});

export default categoriaRouter;
