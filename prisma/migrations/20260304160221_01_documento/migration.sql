-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDENTE', 'ASSINADO');

-- CreateTable
CREATE TABLE "Documento" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);
