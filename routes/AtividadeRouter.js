import express from "express";
import Atividade from "../models/Atividade.js";
import mongoose from "mongoose";

const atividadeRouter = express.Router();

atividadeRouter.get("/", async (req, res) => {
  try {
    const data = await Atividade.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro na busca" });
  }
});

atividadeRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Atividade.findById(id);

    if (!data) {
      return res.status(404).json({ error: "Atividade não encontrada!" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro na busca" });
  }
});

atividadeRouter.post("/", async (req, res) => {
  try {
    const data = new Atividade(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar atividade" });
  }
});

atividadeRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const data = await Atividade.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!data) {
      return res.status(404).json({ error: "Atividade não encontrado" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o Atividade" });
  }
});

atividadeRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const atividadeDeletada = await Atividade.findByIdAndDelete(id);
    if (!atividadeDeletada) {
      return res.status(404).json({ error: "Atividade não encontrada" });
    }

    res.status(200).json({ message: "Atividade deletada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar Atividade" });
  }
});

atividadeRouter.get("/categoria/:idCategoria", async (req, res) => {
  const { idCategoria } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(idCategoria)) {
      return res.status(400).json({ error: "ID de categoria inválido" });
    }

    const atividades = await Atividade.find({ id_categoria: idCategoria })
      .populate("id_categoria")
      .exec();

    if (atividades.length === 0) {
      return res
        .status(404)
        .json({ error: "Nenhuma atividade encontrada para esta categoria" });
    }

    res.status(200).json(atividades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar atividades por categoria" });
  }
});

export default atividadeRouter;
