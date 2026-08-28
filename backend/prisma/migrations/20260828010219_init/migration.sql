-- CreateEnum
CREATE TYPE "StatusCarro" AS ENUM ('DISPONIVEL', 'RESERVADO', 'VENDIDO');

-- CreateTable
CREATE TABLE "Marca" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carro" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "precoCentavos" INTEGER NOT NULL,
    "quilometragem" INTEGER NOT NULL,
    "cor" TEXT NOT NULL,
    "combustivel" TEXT NOT NULL,
    "portas" INTEGER NOT NULL,
    "cambio" TEXT NOT NULL,
    "carroceria" TEXT NOT NULL,
    "finalPlaca" INTEGER,
    "localizacao" TEXT NOT NULL,
    "status" "StatusCarro" NOT NULL DEFAULT 'DISPONIVEL',
    "formasPagamento" TEXT[],
    "marcaId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarroImagem" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "capa" BOOLEAN NOT NULL DEFAULT false,
    "carroId" INTEGER NOT NULL,

    CONSTRAINT "CarroImagem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Marca_nome_key" ON "Marca"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Marca_slug_key" ON "Marca"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Carro_slug_key" ON "Carro"("slug");

-- CreateIndex
CREATE INDEX "Carro_marcaId_idx" ON "Carro"("marcaId");

-- CreateIndex
CREATE INDEX "Carro_status_idx" ON "Carro"("status");

-- CreateIndex
CREATE INDEX "CarroImagem_carroId_idx" ON "CarroImagem"("carroId");

-- AddForeignKey
ALTER TABLE "Carro" ADD CONSTRAINT "Carro_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarroImagem" ADD CONSTRAINT "CarroImagem_carroId_fkey" FOREIGN KEY ("carroId") REFERENCES "Carro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
