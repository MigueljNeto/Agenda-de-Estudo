import { infoNivel } from "../jogo";

export default function Cabecalho({ xp, sequencia }) {
  const { nivel, atual, necessario, progresso } = infoNivel(xp);

  return (
    <header className="cabecalho">
      <h1>📚 Agenda de Estudos</h1>
      <div className="status">
        <span className="nivel">Nível {nivel}</span>
        <div
          className="barra"
          role="progressbar"
          aria-label="Progresso do nível"
          aria-valuemin={0}
          aria-valuemax={necessario}
          aria-valuenow={atual}
        >
          <div style={{ width: `${progresso * 100}%` }} />
        </div>
        <span className="xp-texto">
          {atual} / {necessario} XP
        </span>
        <span
          className={`sequencia${sequencia > 0 ? " ativa" : ""}`}
          title="Dias seguidos concluindo pelo menos uma tarefa"
        >
          🔥 {sequencia} {sequencia === 1 ? "dia" : "dias"}
        </span>
      </div>
    </header>
  );
}
