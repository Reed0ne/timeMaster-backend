import express from "express";
import Atividade from "../models/Atividade.js"; // Modelo Atividade

const relatorioRouter = express.Router();

// Função para calcular a data de uma semana atrás
const calcularSemanaAnterior = () => {
  const hoje = new Date();
  const diaSemana = hoje.getDay(); // Retorna o dia da semana (0-6)

  // Ajusta para a segunda-feira (dia 1 da semana)
  const primeiroDiaSemana = new Date(hoje);
  primeiroDiaSemana.setDate(hoje.getDate() - diaSemana + 1);

  // Subtrai 7 dias para pegar o intervalo da semana anterior
  const inicioSemanaAnterior = new Date(primeiroDiaSemana);
  inicioSemanaAnterior.setDate(primeiroDiaSemana.getDate() - 7);

  // Fim da semana anterior (domingo da semana anterior)
  const fimSemanaAnterior = new Date(primeiroDiaSemana);
  fimSemanaAnterior.setDate(primeiroDiaSemana.getDate() - 1);

  return { inicioSemanaAnterior, fimSemanaAnterior };
};

relatorioRouter.get("/", async (req, res) => {
  try {
    const { momentoConclusao } = req.query; // Pega o parâmetro "momentoConclusao" da query string

    // Se o momentoConclusao não for passado, usamos a data atual
    const dataConclusao = momentoConclusao
      ? new Date(momentoConclusao)
      : new Date();

    // Calcula as datas da semana anterior
    const { inicioSemanaAnterior, fimSemanaAnterior } =
      calcularSemanaAnterior();

    // Agregação para contar as atividades conforme os critérios
    const relatorio = await Atividade.aggregate([
      {
        $facet: {
          // Contagem de atividades concluídas na semana atual
          atividadesConcluidasSemanaAtual: [
            { $match: { concluida: true } },
            { $count: "atividadesConcluidas" },
          ],

          // Contagem de atividades concluídas antes do momentoConclusao
          atividadesConcluidasAntesSemanaAtual: [
            {
              $match: {
                concluida: true,
                momentoConclusao: { $lt: dataConclusao }, // Filtra atividades concluídas antes do momentoConclusao
              },
            },
            { $count: "atividadesConcluidasAntes" },
          ],

          // Contagem de atividades não concluídas na semana atual
          atividadesNaoConcluidasSemanaAtual: [
            { $match: { concluida: false } },
            { $count: "atividadesNaoConcluidas" },
          ],

          // Contagem de atividades Pomodoro (isPommodoro = true) na semana atual
          atividadesPommodoroSemanaAtual: [
            { $match: { isPommodoro: true } },
            { $count: "atividadesPommodoro" },
          ],

          // Contagem de atividades da semana anterior
          atividadesSemanaAnterior: [
            {
              $match: {
                $and: [
                  { inicioAtividade: { $gte: inicioSemanaAnterior } },
                  { fimAtividade: { $lte: fimSemanaAnterior } },
                ],
              },
            },
            { $count: "atividadesSemanaAnterior" },
          ],
        },
      },
      {
        $project: {
          atividadesConcluidasSemanaAtual: {
            $arrayElemAt: [
              "$atividadesConcluidasSemanaAtual.atividadesConcluidas",
              0,
            ],
          },
          atividadesConcluidasAntesSemanaAtual: {
            $arrayElemAt: [
              "$atividadesConcluidasAntesSemanaAtual.atividadesConcluidasAntes",
              0,
            ],
          },
          atividadesNaoConcluidasSemanaAtual: {
            $arrayElemAt: [
              "$atividadesNaoConcluidasSemanaAtual.atividadesNaoConcluidas",
              0,
            ],
          },
          atividadesPommodoroSemanaAtual: {
            $arrayElemAt: [
              "$atividadesPommodoroSemanaAtual.atividadesPommodoro",
              0,
            ],
          },
          atividadesSemanaAnterior: {
            $arrayElemAt: [
              "$atividadesSemanaAnterior.atividadesSemanaAnterior",
              0,
            ],
          },
        },
      },
    ]);

    // Manipula os resultados para que os valores sejam retornados como números
    const semanaAtual = {
      atividadesConcluidas: relatorio[0].atividadesConcluidasSemanaAtual || 0,
      atividadesConcluidasAntes:
        relatorio[0].atividadesConcluidasAntesSemanaAtual || 0,
      atividadesNaoConcluidas:
        relatorio[0].atividadesNaoConcluidasSemanaAtual || 0,
      atividadesPommodoro: relatorio[0].atividadesPommodoroSemanaAtual || 0,
    };

    const semanaPassada = {
      atividadesConcluidas:
        relatorio[0].atividadesConcluidasSemanaAnterior || 0,
      atividadesConcluidasAntes:
        relatorio[0].atividadesConcluidasSemanaAnterior || 0,
      atividadesNaoConcluidas: relatorio[0].atividadesSemanaAnterior || 0,
      atividadesPommodoro: relatorio[0].atividadesSemanaAnterior || 0,
    };

    // Retorno final no formato desejado
    res.status(200).json({
      semanaAtual,
      semanaPassada,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro na busca dos relatórios" });
  }
});

export default relatorioRouter;
