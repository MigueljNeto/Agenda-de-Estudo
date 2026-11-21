const pad = (n) => String(n).padStart(2, "0");
const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function partes(iso) {
  return iso.split("-").map(Number);
}

export function paraISO(data) {
  return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}`;
}

export function hojeISO() {
  return paraISO(new Date());
}

export function somarDias(iso, dias) {
  const [ano, mes, dia] = partes(iso);
  return paraISO(new Date(ano, mes - 1, dia + dias));
}

export function diffDias(de, ate) {
  const [a1, m1, d1] = partes(de);
  const [a2, m2, d2] = partes(ate);
  return Math.round((Date.UTC(a2, m2 - 1, d2) - Date.UTC(a1, m1 - 1, d1)) / 86400000);
}

export function descreverPrazo(prazo, hoje) {
  const dias = diffDias(hoje, prazo);
  if (dias < 0) {
    return { tipo: "atrasada", texto: dias === -1 ? "Atrasada 1 dia" : `Atrasada ${-dias} dias` };
  }
  if (dias === 0) return { tipo: "hoje", texto: "Hoje" };
  if (dias === 1) return { tipo: "proxima", texto: "Amanhã" };
  const [ano, mes, dia] = partes(prazo);
  const semana = DIAS_SEMANA[new Date(ano, mes - 1, dia).getDay()];
  return { tipo: dias <= 7 ? "proxima" : "futura", texto: `${semana} ${pad(dia)}/${pad(mes)}` };
}
