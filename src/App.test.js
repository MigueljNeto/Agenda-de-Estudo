import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { reducer, estadoInicial } from "./estado";
import { calcularXp, infoNivel, sequenciaAtual } from "./jogo";
import { descreverPrazo, somarDias } from "./datas";

beforeEach(() => localStorage.clear());

const HOJE = "2026-11-21";

test("adiciona tarefa com Enter e ela continua depois de recarregar", () => {
  const { unmount } = render(<App />);
  userEvent.type(screen.getByLabelText("Nome da tarefa"), "Lista 3 de Cálculo{enter}");
  expect(screen.getByText("Lista 3 de Cálculo")).toBeInTheDocument();
  expect(screen.getByLabelText("Nome da tarefa")).toHaveValue("");

  unmount();
  render(<App />);
  expect(screen.getByText("Lista 3 de Cálculo")).toBeInTheDocument();
});

test("concluir dá XP, desbloqueia conquista e desmarcar devolve o XP", () => {
  render(<App />);
  userEvent.type(screen.getByLabelText("Nome da tarefa"), "Resumo de História{enter}");
  userEvent.click(screen.getByLabelText("Concluir Resumo de História"));

  expect(screen.getByText("20 / 100 XP")).toBeInTheDocument();
  expect(screen.getByText(/Conquista desbloqueada: Primeiro passo/)).toBeInTheDocument();
  expect(screen.getByText("🔥 1 dia")).toBeInTheDocument();

  userEvent.click(screen.getByLabelText("Concluir Resumo de História"));
  expect(screen.getByText("0 / 100 XP")).toBeInTheDocument();
});

test("edita e exclui tarefa", () => {
  render(<App />);
  userEvent.type(screen.getByLabelText("Nome da tarefa"), "Ler capitulo{enter}");
  userEvent.click(screen.getByLabelText("Editar Ler capitulo"));

  const edicao = screen.getByRole("button", { name: "Salvar" }).closest("form");
  const campo = within(edicao).getByLabelText("Nome da tarefa");
  userEvent.clear(campo);
  userEvent.type(campo, "Ler capítulo 4{enter}");
  expect(screen.getByText("Ler capítulo 4")).toBeInTheDocument();

  userEvent.click(screen.getByLabelText("Excluir Ler capítulo 4"));
  expect(screen.queryByText("Ler capítulo 4")).not.toBeInTheDocument();
});

test("XP depende da prioridade e do prazo", () => {
  expect(calcularXp({ prioridade: "media", prazo: null }, HOJE)).toBe(20);
  expect(calcularXp({ prioridade: "alta", prazo: HOJE }, HOJE)).toBe(53);
  expect(calcularXp({ prioridade: "media", prazo: somarDias(HOJE, -1) }, HOJE)).toBe(10);
});

test("níveis e sequência de dias", () => {
  expect(infoNivel(0).nivel).toBe(1);
  expect(infoNivel(100).nivel).toBe(2);
  expect(infoNivel(299).nivel).toBe(2);
  expect(infoNivel(300).nivel).toBe(3);
  const dias = [somarDias(HOJE, -2), somarDias(HOJE, -1)];
  expect(sequenciaAtual(dias, HOJE)).toBe(2);
  expect(sequenciaAtual([...dias, HOJE], HOJE)).toBe(3);
  expect(sequenciaAtual([somarDias(HOJE, -3)], HOJE)).toBe(0);
});

test("descreve prazos", () => {
  expect(descreverPrazo(somarDias(HOJE, -2), HOJE)).toEqual({ tipo: "atrasada", texto: "Atrasada 2 dias" });
  expect(descreverPrazo(HOJE, HOJE).texto).toBe("Hoje");
  expect(descreverPrazo(somarDias(HOJE, 1), HOJE).texto).toBe("Amanhã");
});

test("excluir matéria deixa as tarefas sem matéria", () => {
  let s = reducer(estadoInicial, { type: "adicionarMateria", nome: "Física", cor: "#000" });
  const materiaId = s.materias[0].id;
  s = reducer(s, { type: "adicionar", hoje: HOJE, dados: { nome: "Lista", materiaId, prazo: null, prioridade: "media" } });
  s = reducer(s, { type: "excluirMateria", id: materiaId });
  expect(s.materias).toHaveLength(0);
  expect(s.tarefas[0].materiaId).toBeNull();
});
