/*
  Warnings:

  - You are about to drop the column `huevos_descarte` on the `registro_packing` table. All the data in the column will be lost.
  - You are about to drop the column `huevos_roto` on the `registro_packing` table. All the data in the column will be lost.
  - You are about to drop the column `huevos_sucio` on the `registro_packing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "registro_packing" DROP COLUMN "huevos_descarte",
DROP COLUMN "huevos_roto",
DROP COLUMN "huevos_sucio",
ADD COLUMN     "cajas_jumbo_xxl" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "descarte_x_unidades" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "huevos_rotos_kg" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "trizados_unidades" INTEGER NOT NULL DEFAULT 0;
