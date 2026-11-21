import { useState } from "react";
import { useApp } from "../estado";

const CORES = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#64748b"];

export default function Materias() {
  const { state, dispatch } = useApp();
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState(CORES[state.materias.length % CORES.length]);
  const [erro, setErro] = useState("");

  const adicionar = (e) => {
    e.preventDefault();
    const limpo = nome.trim();
    if (!limpo) return;
    if (state.materias.some((m) => m.nome.toLowerCase() === limpo.toLowerCase())) {
      setErro("Essa matéria já existe.");
      return;
    }
    dispatch({ type: "adicionarMateria", nome: limpo, cor });
    setNome("");
    setErro("");
    setCor(CORES[(CORES.indexOf(cor) + 1) % CORES.length]);
  };

  const excluir = (materia, total) => {
    const aviso =
      total > 0
        ? `Excluir "${materia.nome}"? As ${total} tarefa(s) dela ficam sem matéria.`
        : `Excluir "${materia.nome}"?`;
    if (window.confirm(aviso)) dispatch({ type: "excluirMateria", id: materia.id });
  };

  return (
    <section>
      <form className="form-materia" onSubmit={adicionar}>
        <input
          type="text"
          aria-label="Nome da matéria"
          placeholder="Nova matéria (ex.: Cálculo I)"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <div className="cores" role="radiogroup" aria-label="Cor da matéria">
          {CORES.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={c === cor}
              aria-label={`Cor ${c}`}
              className={`cor${c === cor ? " escolhida" : ""}`}
              style={{ background: c }}
              onClick={() => setCor(c)}
            />
          ))}
        </div>
        <button type="submit" className="btn adicionar">
          Adicionar
        </button>
      </form>
      {erro && <p className="erro">{erro}</p>}

      {state.materias.length === 0 ? (
        <p className="vazio">Cadastre suas matérias para organizar as tarefas por disciplina.</p>
      ) : (
        <ul className="lista">
          {state.materias.map((m) => {
            const tarefas = state.tarefas.filter((t) => t.materiaId === m.id);
            const pendentes = tarefas.filter((t) => !t.concluida).length;
            return (
              <li key={m.id} className="materia" style={{ "--cor": m.cor }}>
                <span className="materia-cor" />
                <div className="tarefa-corpo">
                  <span className="tarefa-nome">{m.nome}</span>
                  <span className="tarefa-meta">
                    {pendentes} {pendentes === 1 ? "pendente" : "pendentes"} · {tarefas.length - pendentes}{" "}
                    {tarefas.length - pendentes === 1 ? "feita" : "feitas"}
                  </span>
                </div>
                <button
                  className="icone"
                  aria-label={`Excluir ${m.nome}`}
                  title="Excluir"
                  onClick={() => excluir(m, tarefas.length)}
                >
                  🗑️
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
