-- RenameTable
ALTER TABLE "Documento" RENAME TO "Document";

-- RenameColumns
ALTER TABLE "Document" RENAME COLUMN "titulo" TO "title";
ALTER TABLE "Document" RENAME COLUMN "descricao" TO "description";
ALTER TABLE "Document" RENAME COLUMN "criado_em" TO "createdAt";

-- Recreate enum with new values
CREATE TYPE "Status_new" AS ENUM ('PENDING', 'SIGNED');

ALTER TABLE "Document"
ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Document"
ALTER COLUMN "status" TYPE "Status_new"
USING (
  CASE
    WHEN "status"::text = 'PENDENTE' THEN 'PENDING'
    WHEN "status"::text = 'ASSINADO' THEN 'SIGNED'
    ELSE "status"::text
  END::"Status_new"
);

ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";

DROP TYPE "Status_old";

ALTER TABLE "Document"
ALTER COLUMN "status" SET DEFAULT 'PENDING';