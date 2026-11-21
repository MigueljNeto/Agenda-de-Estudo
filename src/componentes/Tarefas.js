import { useState } from "react";
import { useApp } from "../estado";
import { descreverPrazo } from "../datas";
import { calcularXp } from "../jogo";
import FormTarefa from "./FormTarefa";

const NOME_PRIORIDADE = { baixa: "Prioridade baixa", media: "Prioridade média", alta: "Prioridade alta" };

function ItemTarefa({ tarefa }) {
  const { state, dispatch, hoje } = useApp();
  const [editando, setEditando] = useState(false);
  const materia = state.materias.find((m) => m.id === tarefa.materiaId);

  if (editando) {
    return (
      <li className="tarefa editando">
        <FormTarefa
          materias={state.materias}
          textoBotao="Salvar"
          inicial={{
            nome: tarefa.nome,
            materiaId: tarefa.materiaId ?? "",
            prazo: tarefa.prazo ?? "",
            prioridade: tarefa.prioridade,
          }}
          onSalvar={(dados) => {
            dispatch({ type: "editar", id: tarefa.id, dados });
            setEditando(false);
          }}
          onCancelar={() => setEditando(false)}
        />
      </li>
    );
  }

  const prazo = tarefa.prazo && !tarefa.concluida ? descreverPrazo(tarefa.prazo, hoje) : null;

  return (
    <li
      className={`tarefa prioridade-${tarefa.prioridade}${tarefa.concluida ? " feita" : ""}`}
      title={NOME_PRIORIDADE[tarefa.prioridade]}
    >
      <input
        type="checkbox"
        checked={tarefa.concluida}
        aria-label={`Concluir ${tarefa.nome}`}
        onChange={() => dispatch({ type: "alternar", id: tarefa.id, hoje })}
      />
      <div className="tarefa-corpo">
        <span className="tarefa-nome" onDoubleClick={() => setEditando(true)}>
          {tarefa.nome}
        </span>
        <div className="tarefa-meta">
          {materia && (
            <span className="chip" style={{ "--cor": materia.cor }}>
              {materia.nome}
            </span>
          )}
          {prazo && <span className={`prazo prazo-${prazo.tipo}`}>{prazo.texto}</span>}
          {tarefa.concluida ? (
            <span className="xp ganho">+{tarefa.xp} XP</span>
          ) : (
            <span className="xp">vale {calcularXp(tarefa, hoje)} XP</span>
          )}
        </div>
      </div>
      <div className="tarefa-acoes">
        <button className="icone" aria-label={`Editar ${tarefa.nome}`} title="Editar" onClick={() => setEditando(true)}>
          ✏️
        </button>
        <button
          className="icone"
          aria-label={`Excluir ${tarefa.nome}`}
          title="Excluir"
          onClick={() => dispatch({ type: "excluir", id: tarefa.id })}
        >
          🗑️
        </button>
      </div>
    </li>
  );
}

export default function ListaTarefas({ tarefas, vazio }) {
  if (tarefas.length === 0) return vazio ? <p className="vazio">{vazio}</p> : null;
  return (
    <ul className="lista">
      {tarefas.map((t) => (
        <ItemTarefa key={t.id} tarefa={t} />
      ))}
    </ul>
  );
}
