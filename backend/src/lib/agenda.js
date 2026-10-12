// Regras da agenda da oficina: expediente, fuso e grade de horários.
//
// A oficina fica em Sinop–MT (America/Cuiaba, UTC-4 sem horário de verão). Os
// horários são calculados nesse fuso fixo para que o servidor (que pode rodar
// em UTC) e o navegador do cliente concordem sobre o que é "08:00".

const FUSO = '-04:00';
const FUSO_MS = -4 * 60 * 60 * 1000;

/** Dias de funcionamento (0 = domingo) e expediente em minutos desde 00:00. */
const EXPEDIENTE = { dias: [1, 2, 3, 4, 5], inicio: 8 * 60, fim: 18 * 60 };

/** Antecedência mínima para agendar e quanto à frente a agenda abre. */
const ANTECEDENCIA_MIN = 60;
const JANELA_DIAS = 60;

const DATA_RE = /^\d{4}-\d{2}-\d{2}$/;

/** "2026-10-14" válida no calendário (rejeita 2026-02-30). */
function dataValida(data) {
  if (!DATA_RE.test(data)) return false;
  return new Date(`${data}T00:00:00Z`).toISOString().slice(0, 10) === data;
}

const pad = (n) => String(n).padStart(2, '0');
const hhmm = (minutos) => `${pad(Math.floor(minutos / 60))}:${pad(minutos % 60)}`;

/** Instante (Date) correspondente a `data` + `minutos` no fuso da oficina. */
const instante = (data, minutos) => new Date(`${data}T${hhmm(minutos)}:00${FUSO}`);

/** "HH:MM" de um instante, no fuso da oficina. */
const horaLocal = (date) => new Date(date.getTime() + FUSO_MS).toISOString().slice(11, 16);

/** "YYYY-MM-DD" de um instante, no fuso da oficina. */
const dataLocal = (date) => new Date(date.getTime() + FUSO_MS).toISOString().slice(0, 10);

/**
 * Grade de horários de um serviço num dia. A grade avança pela duração do
 * serviço (08:00, 09:00… para 60 min), então horários do mesmo serviço nunca
 * se sobrepõem, e o último termina até o fim do expediente.
 */
function gradeDoDia(data, duracaoMin) {
  const diaSemana = instante(data, 12 * 60).getUTCDay(); // meio-dia local evita virar o dia
  if (!EXPEDIENTE.dias.includes(diaSemana)) return [];

  const grade = [];
  for (let m = EXPEDIENTE.inicio; m + duracaoMin <= EXPEDIENTE.fim; m += duracaoMin) {
    grade.push({ hora: hhmm(m), dataHora: instante(data, m) });
  }
  return grade;
}

/** Horário dentro da janela que pode ser agendado (nem passado, nem longe demais). */
function dentroDaJanela(dataHora, agora = new Date()) {
  const minimo = agora.getTime() + ANTECEDENCIA_MIN * 60 * 1000;
  const maximo = agora.getTime() + JANELA_DIAS * 24 * 60 * 60 * 1000;
  return dataHora.getTime() >= minimo && dataHora.getTime() <= maximo;
}

/** O instante pertence à grade do serviço naquele dia? */
function pertenceAGrade(dataHora, duracaoMin) {
  return gradeDoDia(dataLocal(dataHora), duracaoMin).some(
    (h) => h.dataHora.getTime() === dataHora.getTime(),
  );
}

module.exports = {
  EXPEDIENTE,
  JANELA_DIAS,
  dataValida,
  dataLocal,
  horaLocal,
  gradeDoDia,
  dentroDaJanela,
  pertenceAGrade,
};
