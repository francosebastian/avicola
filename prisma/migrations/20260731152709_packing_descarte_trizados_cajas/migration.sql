/*
  Warnings:

  - You are about to drop the column `descarte_x_unidades` on the `registro_packing` table. All the data in the column will be lost.
  - You are about to drop the column `trizados_unidades` on the `registro_packing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "registro_packing" DROP COLUMN "descarte_x_unidades",
DROP COLUMN "trizados_unidades",
ADD COLUMN     "cajas_descarte_x" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "cajas_trizados" INTEGER NOT NULL DEFAULT 0;

-- Seed formatos/inventario para las nuevas categorías de venta (cajas de 100 uds)
INSERT INTO "formato_cajas" ("id", "categoria", "unidades_por_caja", "activo")
VALUES (gen_random_uuid(), 'descarte_x', 100, true)
ON CONFLICT ("categoria") DO NOTHING;

INSERT INTO "formato_cajas" ("id", "categoria", "unidades_por_caja", "activo")
VALUES (gen_random_uuid(), 'trizados', 100, true)
ON CONFLICT ("categoria") DO NOTHING;

INSERT INTO "inventario_packing" ("id", "categoria", "stock_cajas", "stock_unidades", "stock_minimo_cajas", "updated_at")
VALUES (gen_random_uuid(), 'descarte_x', 0, 0, 0, now())
ON CONFLICT ("categoria") DO NOTHING;

INSERT INTO "inventario_packing" ("id", "categoria", "stock_cajas", "stock_unidades", "stock_minimo_cajas", "updated_at")
VALUES (gen_random_uuid(), 'trizados', 0, 0, 0, now())
ON CONFLICT ("categoria") DO NOTHING;
