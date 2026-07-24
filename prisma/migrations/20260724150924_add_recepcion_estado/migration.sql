-- AlterTable
ALTER TABLE "lotes" ALTER COLUMN "estado" SET DEFAULT 'recepcion';

-- AlterTable
ALTER TABLE "secciones" ADD COLUMN     "tipo" TEXT NOT NULL DEFAULT 'produccion';
