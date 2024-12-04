import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/DbConfig.js";
import usuarioRouter from "./routes/UsuarioRouter.js";
import atividadeRouter from "./routes/AtividadeRouter.js";
import categoriaRouter from "./routes/CategoriaRouter.js";
import subAtividadeRouter from "./routes/SubAtividadeRouter.js";
import pommodoroRouter from "./routes/PommodoroRouter.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3002;

connectDB();
app.use(express.json());
app.use("/usuarios", usuarioRouter);
app.use("/atividades", atividadeRouter);
app.use("/subAtividades", subAtividadeRouter);
app.use("/categorias", categoriaRouter);
app.use("/pommodoro", pommodoroRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
