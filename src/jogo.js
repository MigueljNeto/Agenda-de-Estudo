import { diffDias, somarDias } from "./datas";

export const XP_BASE = { baixa: 10, media: 20, alta: 35 };

export function calcularXp(tarefa, hoje) {
  const base = XP_BASE[tarefa.prioridade] ?? XP_BASE.media;
  if (!tarefa.prazo) return base;
  return diffDias(hoje, tarefa.prazo) >= 0 ? Math.round(base * 1.5) : Math.round(base / 2);
}

function xpDoNivel(nivel) {
  return 50 * nivel * (nivel - 1);
}

export function infoNivel(xp) {
  let nivel = 1;
  while (xp >= xpDoNivel(nivel + 1)) nivel++;
  const inicio = xpDoNivel(nivel);
  const necessario = xpDoNivel(nivel + 1) - inicio;
  return { nivel, atual: xp - inicio, necessario, progresso: (xp - inicio) / necessario };
}

export function sequenciaAtual(diasAtivos, hoje) {
  const dias = new Set(diasAtivos);
  let dia = dias.has(hoje) ? hoje : somarDias(hoje, -1);
  let total = 0;
  while (dias.has(dia)) {
    total++;
    dia = somarDias(dia, -1);
  }
  return total;
}

export const CONQUISTAS = [
  { id: "primeira", icone: "🌱", titulo: "Primeiro passo", descricao: "Conclua sua primeira tarefa", meta: 1, valor: (c) => c.concluidas },
  { id: "dez", icone: "📘", titulo: "Pegando ritmo", descricao: "Conclua 10 tarefas", meta: 10, valor: (c) => c.concluidas },
  { id: "cinquenta", icone: "🏛️", titulo: "Máquina de estudos", descricao: "Conclua 50 tarefas", meta: 50, valor: (c) => c.concluidas },
  { id: "pontual", icone: "⏰", titulo: "Pontual", descricao: "Entregue 5 tarefas dentro do prazo", meta: 5, valor: (c) => c.noPrazo },
  { id: "relogio", icone: "🎯", titulo: "Relógio suíço", descricao: "Entregue 20 tarefas dentro do prazo", meta: 20, valor: (c) => c.noPrazo },
  { id: "chamas", icone: "🔥", titulo: "Em chamas", descricao: "Conclua tarefas 3 dias seguidos", meta: 3, valor: (c) => c.sequencia },
  { id: "semana", icone: "🗓️", titulo: "Semana perfeita", descricao: "Conclua tarefas 7 dias seguidos", meta: 7, valor: (c) => c.sequencia },
  { id: "organizado", icone: "🗂️", titulo: "Organizado", descricao: "Cadastre 3 matérias", meta: 3, valor: (c) => c.materias },
  { id: "veterano", icone: "⭐", titulo: "Veterano", descricao: "Chegue ao nível 5", meta: 5, valor: (c) => c.nivel },
];

export function conquistasAtingidas(contexto) {
  return CONQUISTAS.filter((c) => c.valor(contexto) >= c.meta).map((c) => c.id);
}
