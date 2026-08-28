-- CreateEnum
CREATE TYPE "TipoProduto" AS ENUM ('PECA', 'ACESSORIO');

-- AlterTable
ALTER TABLE "Carro" ADD COLUMN     "modeloVeiculoId" INTEGER;

-- CreateTable
CREATE TABLE "ModeloVeiculo" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anoInicio" INTEGER,
    "anoFim" INTEGER,

    CONSTRAINT "ModeloVeiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tipo" "TipoProduto" NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "precoCentavos" INTEGER NOT NULL,
    "estoque" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT,
    "tipo" "TipoProduto" NOT NULL,
    "imagemUrl" TEXT,
    "categoriaId" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoCompatibilidade" (
    "produtoId" INTEGER NOT NULL,
    "modeloVeiculoId" INTEGER NOT NULL,

    CONSTRAINT "ProdutoCompatibilidade_pkey" PRIMARY KEY ("produtoId","modeloVeiculoId")
);

-- CreateTable
CREATE TABLE "MensagemContato" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MensagemContato_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModeloVeiculo_slug_key" ON "ModeloVeiculo"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ModeloVeiculo_marca_modelo_key" ON "ModeloVeiculo"("marca", "modelo");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_slug_key" ON "Categoria"("slug");

-- CreateIndex
CREATE INDEX "Categoria_tipo_idx" ON "Categoria"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_slug_key" ON "Produto"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_sku_key" ON "Produto"("sku");

-- CreateIndex
CREATE INDEX "Produto_tipo_idx" ON "Produto"("tipo");

-- CreateIndex
CREATE INDEX "Produto_categoriaId_idx" ON "Produto"("categoriaId");

-- CreateIndex
CREATE INDEX "ProdutoCompatibilidade_modeloVeiculoId_idx" ON "ProdutoCompatibilidade"("modeloVeiculoId");

-- CreateIndex
CREATE INDEX "MensagemContato_lida_idx" ON "MensagemContato"("lida");

-- CreateIndex
CREATE INDEX "Carro_modeloVeiculoId_idx" ON "Carro"("modeloVeiculoId");

-- AddForeignKey
ALTER TABLE "Carro" ADD CONSTRAINT "Carro_modeloVeiculoId_fkey" FOREIGN KEY ("modeloVeiculoId") REFERENCES "ModeloVeiculo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoCompatibilidade" ADD CONSTRAINT "ProdutoCompatibilidade_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoCompatibilidade" ADD CONSTRAINT "ProdutoCompatibilidade_modeloVeiculoId_fkey" FOREIGN KEY ("modeloVeiculoId") REFERENCES "ModeloVeiculo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
