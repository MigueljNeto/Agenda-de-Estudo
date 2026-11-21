import { useState } from "react";
import { ordenarTarefas, useApp } from "../estado";
import { diffDias } from "../datas";
import ListaTarefas from "./Tarefas";

export function VisaoSemana() {
  const { state, hoje } = useApp();
  const pendentes = ordenarTarefas(state.tarefas.filter((t) => !t.concluida));
  const dias = (t) => diffDias(hoje, t.prazo);

  const grupos = [
    { id: "atrasadas", titulo: "Atrasadas", itens: pendentes.filter((t) => t.prazo && dias(t) < 0) },
    { id: "hoje", titulo: "Hoje", itens: pendentes.filter((t) => t.prazo && dias(t) === 0) },
    { id: "semana", titulo: "Próximos 7 dias", itens: pendentes.filter((t) => t.prazo && dias(t) >= 1 && dias(t) <= 7) },
    { id: "depois", titulo: "Mais adiante", itens: pendentes.filter((t) => t.prazo && dias(t) > 7) },
    { id: "sem-prazo", titulo: "Sem prazo", itens: pendentes.filter((t) => !t.prazo) },
  ].filter((g) => g.itens.length > 0);

  const feitasHoje = state.tarefas.filter((t) => t.concluida && t.concluidaEm === hoje);

  return (
    <section>
      <p className="resumo">
        {feitasHoje.length} {feitasHoje.length === 1 ? "feita" : "feitas"} hoje · {pendentes.length}{" "}
        {pendentes.length === 1 ? "pendente" : "pendentes"}
      </p>
      {pendentes.length === 0 && <p className="vazio">Nada pendente. Aproveite! 🎉</p>}
      {grupos.map((g) => (
        <div key={g.id} className={`grupo grupo-${g.id}`}>
          <h2>
            {g.titulo} <span className="contagem">{g.itens.length}</span>
          </h2>
          <ListaTarefas tarefas={g.itens} />
        </div>
      ))}
      {feitasHoje.length > 0 && (
        <div className="grupo grupo-feitas">
          <h2>
            Feitas hoje <span className="contagem">{feitasHoje.length}</span>
          </h2>
          <ListaTarefas tarefas={feitasHoje} />
        </div>
      )}
    </section>
  );
}

const FILTROS = [
  { id: "todas", nome: "Todas" },
  { id: "pendentes", nome: "Pendentes" },
  { id: "concluidas", nome: "Concluídas" },
];

export function VisaoTodas() {
  const { state, dispatch } = useApp();
  const [filtro, setFiltro] = useState("todas");
  const [materia, setMateria] = useState("todas");

  const daMateria = state.tarefas.filter((t) => {
    if (materia === "todas") return true;
    if (materia === "sem") return !t.materiaId;
    return t.materiaId === materia;
  });
  const feitas = daMateria.filter((t) => t.concluida).length;
  const visiveis = ordenarTarefas(
    daMateria.filter((t) => {
      if (filtro === "pendentes") return !t.concluida;
      if (filtro === "concluidas") return t.concluida;
      return true;
    })
  );
  const totalConcluidas = state.tarefas.filter((t) => t.concluida).length;

  const limpar = () => {
    if (window.confirm(`Remover ${totalConcluidas} tarefa(s) concluída(s)? O XP ganho continua com você.`)) {
      dispatch({ type: "limparConcluidas" });
    }
  };

  return (
    <section>
      <div className="filtros">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            className={filtro === f.id ? "ativo" : ""}
            aria-pressed={filtro === f.id}
            onClick={() => setFiltro(f.id)}
          >
            {f.nome}
          </button>
        ))}
        <select aria-label="Filtrar por matéria" value={materia} onChange={(e) => setMateria(e.target.value)}>
          <option value="todas">Todas as matérias</option>
          <option value="sem">Sem matéria</option>
          {state.materias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
            </option>
          ))}
        </select>
      </div>

      {daMateria.length > 0 && (
        <div className="progresso-geral">
          <span>
            {feitas} de {daMateria.length} concluídas
          </span>
          <div className="barra">
            <div style={{ width: `${(feitas / daMateria.length) * 100}%` }} />
          </div>
        </div>
      )}

      <ListaTarefas tarefas={visiveis} vazio="Nenhuma tarefa por aqui." />

      {totalConcluidas > 0 && (
        <button className="btn-link" onClick={limpar}>
          Limpar todas as concluídas
        </button>
      )}
    </section>
  );
}
