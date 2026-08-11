/*
  Warnings:

  - You are about to drop the column `destino_galpon_id` on the `fabricacion_alimento` table. All the data in the column will be lost.
  - You are about to drop the column `destino_seccion_id` on the `fabricacion_alimento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "fabricacion_alimento" DROP COLUMN "destino_galpon_id",
DROP COLUMN "destino_seccion_id",
ADD COLUMN     "destino" TEXT;

-- Catálogo de insumos de fábrica (lista exacta)
DELETE FROM "stock_insumos"
WHERE "tipo_insumo" NOT IN ('Maíz','Soya','Conchuela','Nutrameal','Harinilla','Núcleo Ponedora','Núcleo Pollita','Fosfato Bicálcico','Sal','Lisina','Metionina','Monsigran','Biomin','Mycofix');

INSERT INTO "stock_insumos" ("id", "tipo_insumo", "stock_actual_kg", "stock_minimo_kg", "updated_at") VALUES
(gen_random_uuid(), 'Nutrameal', 0, 100, now()),
(gen_random_uuid(), 'Núcleo Ponedora', 0, 100, now()),
(gen_random_uuid(), 'Núcleo Pollita', 0, 100, now()),
(gen_random_uuid(), 'Fosfato Bicálcico', 0, 100, now()),
(gen_random_uuid(), 'Sal', 0, 100, now()),
(gen_random_uuid(), 'Lisina', 0, 50, now()),
(gen_random_uuid(), 'Metionina', 0, 50, now()),
(gen_random_uuid(), 'Monsigran', 0, 50, now()),
(gen_random_uuid(), 'Biomin', 0, 50, now()),
(gen_random_uuid(), 'Mycofix', 0, 50, now())
ON CONFLICT ("tipo_insumo") DO NOTHING;
