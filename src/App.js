import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AppContext, carregar, novoId, reducer, salvar } from "./estado";
import { hojeISO } from "./datas";
import { CONQUISTAS, conquistasAtingidas, infoNivel, sequenciaAtual } from "./jogo";
import Cabecalho from "./componentes/Cabecalho";
import FormTarefa from "./componentes/FormTarefa";
import { VisaoSemana, VisaoTodas } from "./componentes/Visoes";
import Materias from "./componentes/Materias";
import Conquistas from "./componentes/Conquistas";

const ABAS = [
  { id: "semana", nome: "Esta semana" },
  { id: "todas", nome: "Todas" },
  { id: "materias", nome: "Matérias" },
  { id: "conquistas", nome: "Conquistas" },
];

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, carregar);
  const [hoje, setHoje] = useState(hojeISO);
  const [aba, setAba] = useState("semana");
  const [avisos, setAvisos] = useState([]);
  const xpAnterior = useRef(state.xp);

  useEffect(() => salvar(state), [state]);

  useEffect(() => {
    const relogio = setInterval(() => setHoje(hojeISO()), 60000);
    return () => clearInterval(relogio);
  }, []);

  const avisar = useCallback((texto, tipo) => {
    const id = novoId();
    setAvisos((lista) => [...lista, { id, texto, tipo }]);
    setTimeout(() => setAvisos((lista) => lista.filter((a) => a.id !== id)), 3500);
  }, []);

  useEffect(() => {
    const antes = xpAnterior.current;
    xpAnterior.current = state.xp;
    if (state.xp <= antes) return;
    avisar(`+${state.xp - antes} XP`, "xp");
    const nivel = infoNivel(state.xp).nivel;
    if (nivel > infoNivel(antes).nivel) avisar(`⬆️ Você subiu para o nível ${nivel}!`, "nivel");
  }, [state.xp, avisar]);

  const sequencia = sequenciaAtual(state.diasAtivos, hoje);
  const contexto = {
    concluidas: state.stats.concluidas,
    noPrazo: state.stats.noPrazo,
    sequencia,
    nivel: infoNivel(state.xp).nivel,
    materias: state.materias.length,
  };
  const novas = conquistasAtingidas(contexto)
    .filter((id) => !state.desbloqueadas.includes(id))
    .join(",");

  useEffect(() => {
    if (!novas) return;
    const ids = novas.split(",");
    dispatch({ type: "desbloquear", ids });
    ids.forEach((id) => {
      const c = CONQUISTAS.find((x) => x.id === id);
      avisar(`${c.icone} Conquista desbloqueada: ${c.titulo}`, "conquista");
    });
  }, [novas, avisar]);

  return (
    <AppContext.Provider value={{ state, dispatch, hoje }}>
      <div className="app">
        <Cabecalho xp={state.xp} sequencia={sequencia} />

        <main className="container">
          {(aba === "semana" || aba === "todas") && (
            <FormTarefa
              materias={state.materias}
              textoBotao="Adicionar"
              onSalvar={(dados) => dispatch({ type: "adicionar", dados, hoje })}
            />
          )}

          <nav className="abas" role="tablist">
            {ABAS.map((a) => (
              <button
                key={a.id}
                role="tab"
                aria-selected={aba === a.id}
                className={aba === a.id ? "ativo" : ""}
                onClick={() => setAba(a.id)}
              >
                {a.nome}
              </button>
            ))}
          </nav>

          {aba === "semana" && <VisaoSemana />}
          {aba === "todas" && <VisaoTodas />}
          {aba === "materias" && <Materias />}
          {aba === "conquistas" && <Conquistas contexto={contexto} />}
        </main>

        <div className="avisos" aria-live="polite">
          {avisos.map((a) => (
            <div key={a.id} className={`aviso aviso-${a.tipo}`}>
              {a.texto}
            </div>
          ))}
        </div>
      </div>
    </AppContext.Provider>
  );
}
