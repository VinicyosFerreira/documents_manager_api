/*
  Warnings:

  - Added the required column `documentKey` to the `Documento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Documento" ADD COLUMN     "documentKey" TEXT NOT NULL;
