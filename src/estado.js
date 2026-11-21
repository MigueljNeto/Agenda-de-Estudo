import { createContext, useContext } from "react";
import { diffDias } from "./datas";
import { calcularXp } from "./jogo";

const CHAVE = "agenda-estudos:v1";

export const estadoInicial = {
  tarefas: [],
  materias: [],
  xp: 0,
  diasAtivos: [],
  stats: { concluidas: 0, noPrazo: 0 },
  desbloqueadas: [],
};

export function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    if (!salvo) return estadoInicial;
    return { ...estadoInicial, ...salvo, stats: { ...estadoInicial.stats, ...salvo.stats } };
  } catch {
    return estadoInicial;
  }
}

export function salvar(estado) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {}
}

export function novoId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const PESO_PRIORIDADE = { alta: 0, media: 1, baixa: 2 };

export function ordenarTarefas(tarefas) {
  return [...tarefas].sort((a, b) => {
    if (a.concluida !== b.concluida) return a.concluida ? 1 : -1;
    if (a.prazo !== b.prazo) {
      if (!a.prazo) return 1;
      if (!b.prazo) return -1;
      return a.prazo < b.prazo ? -1 : 1;
    }
    return PESO_PRIORIDADE[a.prioridade] - PESO_PRIORIDADE[b.prioridade];
  });
}

function atualizarTarefa(tarefas, id, mudancas) {
  return tarefas.map((t) => (t.id === id ? { ...t, ...mudancas } : t));
}

function concluir(estado, tarefa, hoje) {
  const xp = calcularXp(tarefa, hoje);
  const noPrazo = Boolean(tarefa.prazo) && diffDias(hoje, tarefa.prazo) >= 0;
  return {
    ...estado,
    xp: estado.xp + xp,
    diasAtivos: estado.diasAtivos.includes(hoje) ? estado.diasAtivos : [...estado.diasAtivos, hoje],
    stats: {
      concluidas: estado.stats.concluidas + 1,
      noPrazo: estado.stats.noPrazo + (noPrazo ? 1 : 0),
    },
    tarefas: atualizarTarefa(estado.tarefas, tarefa.id, { concluida: true, concluidaEm: hoje, xp, noPrazo }),
  };
}

function desfazer(estado, tarefa, hoje) {
  const outraHoje = estado.tarefas.some(
    (t) => t.id !== tarefa.id && t.concluida && t.concluidaEm === hoje
  );
  const tirarDia = tarefa.concluidaEm === hoje && !outraHoje;
  return {
    ...estado,
    xp: Math.max(0, estado.xp - tarefa.xp),
    diasAtivos: tirarDia ? estado.diasAtivos.filter((d) => d !== hoje) : estado.diasAtivos,
    stats: {
      concluidas: Math.max(0, estado.stats.concluidas - 1),
      noPrazo: Math.max(0, estado.stats.noPrazo - (tarefa.noPrazo ? 1 : 0)),
    },
    tarefas: atualizarTarefa(estado.tarefas, tarefa.id, { concluida: false, concluidaEm: null, xp: 0, noPrazo: false }),
  };
}

export function reducer(estado, acao) {
  switch (acao.type) {
    case "adicionar":
      return {
        ...estado,
        tarefas: [
          ...estado.tarefas,
          {
            id: novoId(),
            ...acao.dados,
            concluida: false,
            concluidaEm: null,
            criadaEm: acao.hoje,
            xp: 0,
            noPrazo: false,
          },
        ],
      };

    case "editar":
      return { ...estado, tarefas: atualizarTarefa(estado.tarefas, acao.id, acao.dados) };

    case "excluir":
      return { ...estado, tarefas: estado.tarefas.filter((t) => t.id !== acao.id) };

    case "limparConcluidas":
      return { ...estado, tarefas: estado.tarefas.filter((t) => !t.concluida) };

    case "alternar": {
      const tarefa = estado.tarefas.find((t) => t.id === acao.id);
      if (!tarefa) return estado;
      return tarefa.concluida ? desfazer(estado, tarefa, acao.hoje) : concluir(estado, tarefa, acao.hoje);
    }

    case "adicionarMateria":
      return {
        ...estado,
        materias: [...estado.materias, { id: novoId(), nome: acao.nome, cor: acao.cor }],
      };

    case "excluirMateria":
      return {
        ...estado,
        materias: estado.materias.filter((m) => m.id !== acao.id),
        tarefas: estado.tarefas.map((t) => (t.materiaId === acao.id ? { ...t, materiaId: null } : t)),
      };

    case "desbloquear": {
      const novas = acao.ids.filter((id) => !estado.desbloqueadas.includes(id));
      if (novas.length === 0) return estado;
      return { ...estado, desbloqueadas: [...estado.desbloqueadas, ...novas] };
    }

    default:
      return estado;
  }
}

export const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}
