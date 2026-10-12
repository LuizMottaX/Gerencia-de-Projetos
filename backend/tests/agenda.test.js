import { describe, it, expect } from 'vitest';
import {
  dataValida,
  gradeDoDia,
  dentroDaJanela,
  pertenceAGrade,
  horaLocal,
  dataLocal,
} from '../src/lib/agenda.js';

const SEGUNDA = '2026-10-12';
const horas = (data, duracao) => gradeDoDia(data, duracao).map((h) => h.hora);

describe('agenda', () => {
  it('gera a grade pela duração do serviço, terminando até as 18:00', () => {
    expect(horas(SEGUNDA, 60)).toEqual([
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ]);
    expect(horas(SEGUNDA, 90)).toEqual(['08:00', '09:30', '11:00', '12:30', '14:00', '15:30']);
    expect(horas(SEGUNDA, 180)).toEqual(['08:00', '11:00', '14:00']);
  });

  it('não abre no fim de semana', () => {
    expect(gradeDoDia('2026-10-17', 60)).toEqual([]); // sábado
    expect(gradeDoDia('2026-10-18', 60)).toEqual([]); // domingo
  });

  it('calcula os horários no fuso de Cuiabá (UTC-4), independente do servidor', () => {
    const [primeiro] = gradeDoDia(SEGUNDA, 60);
    expect(primeiro.dataHora.toISOString()).toBe('2026-10-12T12:00:00.000Z');
    expect(horaLocal(primeiro.dataHora)).toBe('08:00');
    expect(dataLocal(new Date('2026-10-13T02:00:00Z'))).toBe('2026-10-12'); // 22:00 local
  });

  it('valida datas de calendário', () => {
    expect(dataValida('2026-10-12')).toBe(true);
    expect(dataValida('2026-02-30')).toBe(false);
    expect(dataValida('12/10/2026')).toBe(false);
  });

  it('só aceita horários da grade', () => {
    expect(pertenceAGrade(new Date('2026-10-12T08:00:00-04:00'), 60)).toBe(true);
    expect(pertenceAGrade(new Date('2026-10-12T08:30:00-04:00'), 60)).toBe(false);
    expect(pertenceAGrade(new Date('2026-10-12T17:00:00-04:00'), 90)).toBe(false); // passaria das 18h
    expect(pertenceAGrade(new Date('2026-10-17T08:00:00-04:00'), 60)).toBe(false); // sábado
  });

  it('exige 1h de antecedência e no máximo 60 dias à frente', () => {
    const agora = new Date('2026-10-12T10:00:00-04:00');
    expect(dentroDaJanela(new Date('2026-10-12T10:30:00-04:00'), agora)).toBe(false);
    expect(dentroDaJanela(new Date('2026-10-12T11:00:00-04:00'), agora)).toBe(true);
    expect(dentroDaJanela(new Date('2026-12-20T08:00:00-04:00'), agora)).toBe(false);
  });
});
