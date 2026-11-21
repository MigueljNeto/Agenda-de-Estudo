import { useApp } from "../estado";
import { CONQUISTAS } from "../jogo";

export default function Conquistas({ contexto }) {
  const { state } = useApp();
  const total = state.desbloqueadas.length;

  return (
    <section>
      <p className="resumo">
        {total} de {CONQUISTAS.length} conquistas desbloqueadas · {contexto.concluidas} tarefas concluídas ·{" "}
        {contexto.noPrazo} no prazo
      </p>
      <ul className="conquistas">
        {CONQUISTAS.map((c) => {
          const feita = state.desbloqueadas.includes(c.id);
          const valor = Math.min(c.valor(contexto), c.meta);
          return (
            <li key={c.id} className={`conquista${feita ? " desbloqueada" : ""}`}>
              <span className="conquista-icone">{feita ? c.icone : "🔒"}</span>
              <strong>{c.titulo}</strong>
              <span className="conquista-desc">{c.descricao}</span>
              {!feita && (
                <div className="barra pequena" aria-label={`${valor} de ${c.meta}`}>
                  <div style={{ width: `${(valor / c.meta) * 100}%` }} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
