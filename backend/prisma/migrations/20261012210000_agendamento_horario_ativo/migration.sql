-- A trava de horário passa de (servicoId, dataHora) para (servicoId, horarioAtivo).
-- horarioAtivo = dataHora enquanto o agendamento ocupa a agenda e NULL quando
-- cancelado, então cancelar libera o horário (o Postgres aceita vários NULL).

-- AlterTable
ALTER TABLE "Agendamento" ADD COLUMN     "horarioAtivo" TIMESTAMP(3);

-- Backfill: agendamentos existentes que não estão cancelados continuam ocupando o horário.
UPDATE "Agendamento" SET "horarioAtivo" = "dataHora" WHERE "status" <> 'CANCELADO';

-- DropIndex
DROP INDEX "Agendamento_servicoId_dataHora_key";

-- CreateIndex
CREATE UNIQUE INDEX "Agendamento_servicoId_horarioAtivo_key" ON "Agendamento"("servicoId", "horarioAtivo");
