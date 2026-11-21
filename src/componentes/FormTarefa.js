import { useState } from "react";

const VAZIO = { nome: "", materiaId: "", prazo: "", prioridade: "media" };

export default function FormTarefa({ materias, inicial, textoBotao, onSalvar, onCancelar }) {
  const [dados, setDados] = useState(inicial ?? VAZIO);

  const mudar = (campo) => (e) => setDados({ ...dados, [campo]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const nome = dados.nome.trim();
    if (!nome) return;
    onSalvar({
      nome,
      materiaId: dados.materiaId || null,
      prazo: dados.prazo || null,
      prioridade: dados.prioridade,
    });
    if (!inicial) setDados({ ...VAZIO, materiaId: dados.materiaId });
  };

  const teclas = (e) => {
    if (e.key === "Escape" && onCancelar) onCancelar();
  };

  return (
    <form className="form-tarefa" onSubmit={enviar} onKeyDown={teclas}>
      <input
        className="campo-nome"
        type="text"
        aria-label="Nome da tarefa"
        placeholder="O que precisa ser feito? (ex.: Lista 3 de Cálculo)"
        value={dados.nome}
        onChange={mudar("nome")}
        autoFocus={Boolean(inicial)}
      />
      <div className="form-linha">
        <select aria-label="Matéria" value={dados.materiaId} onChange={mudar("materiaId")}>
          <option value="">Sem matéria</option>
          {materias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
            </option>
          ))}
        </select>
        <input type="date" aria-label="Prazo" value={dados.prazo} onChange={mudar("prazo")} />
        <select aria-label="Prioridade" value={dados.prioridade} onChange={mudar("prioridade")}>
          <option value="baixa">Prioridade baixa</option>
          <option value="media">Prioridade média</option>
          <option value="alta">Prioridade alta</option>
        </select>
        <button type="submit" className="btn adicionar">
          {textoBotao}
        </button>
        {onCancelar && (
          <button type="button" className="btn secundario" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
