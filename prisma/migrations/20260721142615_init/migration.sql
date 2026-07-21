-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'galponero',
    "pin" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimo_acceso" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "galpon_id" TEXT,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galpones" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'jaula',
    "capacidad_maxima" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "galpones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secciones" (
    "id" TEXT NOT NULL,
    "galpon_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT,
    "capacidad_maxima" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "secciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lotes" (
    "id" TEXT NOT NULL,
    "codigo_lote" TEXT NOT NULL,
    "seccion_id" TEXT NOT NULL,
    "linea_genetica" TEXT NOT NULL,
    "proveedor_pollita" TEXT,
    "cantidad_inicial" INTEGER NOT NULL,
    "fecha_recepcion" DATE NOT NULL,
    "fecha_nacimiento" DATE,
    "peso_inicial_promedio" DECIMAL(5,2),
    "costo_pollita_unitario" DECIMAL(10,2),
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "fecha_cierre" DATE,
    "motivo_cierre" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "lotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_lote" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "tipo_evento" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "descripcion" TEXT,
    "foto_url" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_lote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_diario" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "seccion_id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "aves_vivas" INTEGER,
    "bajas_dia" INTEGER,
    "huevos_producidos" INTEGER,
    "huevos_jumbo" INTEGER DEFAULT 0,
    "huevos_super" INTEGER DEFAULT 0,
    "huevos_extra" INTEGER DEFAULT 0,
    "huevos_primera" INTEGER DEFAULT 0,
    "huevos_segunda" INTEGER DEFAULT 0,
    "huevos_tercera" INTEGER DEFAULT 0,
    "huevos_subproducto" INTEGER DEFAULT 0,
    "consumo_alimento_kg" DECIMAL(10,2),
    "consumo_agua_litros" DECIMAL(10,2),
    "lectura_medidor_agua" DECIMAL(10,2),
    "temperatura_min" DECIMAL(4,1),
    "temperatura_max" DECIMAL(4,1),
    "observaciones" TEXT,
    "foto_registro" TEXT,
    "registrado_por" TEXT,
    "sincronizado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registro_diario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muestreo_peso" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "aves_muestreadas" INTEGER NOT NULL,
    "peso_promedio_gramos" DECIMAL(6,2) NOT NULL,
    "uniformidad_porcentaje" DECIMAL(5,2),
    "cv" DECIMAL(5,2),
    "peso_min" DECIMAL(6,2),
    "peso_max" DECIMAL(6,2),
    "observaciones" TEXT,

    CONSTRAINT "muestreo_peso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consumo_agua" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "seccion_id" TEXT,
    "fecha" DATE NOT NULL,
    "lectura_medidor" DECIMAL(10,2),
    "litros_consumidos" DECIMAL(10,2),
    "aves_periodo" INTEGER,
    "observaciones" TEXT,

    CONSTRAINT "consumo_agua_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programa_iluminacion" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "semana_vida" INTEGER NOT NULL,
    "horas_luz" DECIMAL(4,2) NOT NULL,
    "intensidad_lux" INTEGER,
    "hora_encendido" TEXT,
    "hora_apagado" TEXT,
    "tipo_periodo" TEXT NOT NULL DEFAULT 'postura',

    CONSTRAINT "programa_iluminacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_iluminacion_diario" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "seccion_id" TEXT,
    "fecha" DATE NOT NULL,
    "horas_luz_reales" DECIMAL(4,2),
    "hora_encendido_real" TEXT,
    "hora_apagado_real" TEXT,
    "intensidad_lux" INTEGER,
    "observaciones" TEXT,

    CONSTRAINT "registro_iluminacion_diario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_ambientales" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "seccion_id" TEXT NOT NULL,
    "fecha_hora" TIMESTAMPTZ NOT NULL,
    "temperatura" DECIMAL(4,1),
    "humedad" DECIMAL(4,1),
    "amoniaco_ppm" DECIMAL(5,1),
    "co2_ppm" DECIMAL(6,1),
    "velocidad_aire_ms" DECIMAL(4,2),
    "fuente" TEXT NOT NULL DEFAULT 'manual',

    CONSTRAINT "registros_ambientales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formulas_alimento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo_alimento" TEXT NOT NULL,
    "ingredientes" JSONB NOT NULL,
    "costo_kg_estimado" DECIMAL(8,4),
    "proteina_bruta" DECIMAL(5,2),
    "energia_metabolizable" DECIMAL(6,2),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "formulas_alimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consumo_alimento_diario" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "tipo_alimento" TEXT NOT NULL,
    "cantidad_kg" DECIMAL(10,2) NOT NULL,
    "formula_id" TEXT,
    "inventario_movimiento_id" TEXT,

    CONSTRAINT "consumo_alimento_diario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recepcion_insumos" (
    "id" TEXT NOT NULL,
    "fecha_llegada" DATE NOT NULL,
    "proveedor" TEXT NOT NULL,
    "vehiculo" TEXT,
    "patente" TEXT,
    "tipo_insumo" TEXT NOT NULL,
    "cantidad_kg" DECIMAL(12,2) NOT NULL,
    "numero_lote" TEXT NOT NULL,
    "numero_guia" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recepcion_insumos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_insumos" (
    "id" TEXT NOT NULL,
    "tipo_insumo" TEXT NOT NULL,
    "stock_actual_kg" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "stock_minimo_kg" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "stock_insumos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fabricacion_alimento" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "formula_id" TEXT NOT NULL,
    "cantidad_producida_kg" DECIMAL(12,2) NOT NULL,
    "destino_galpon_id" TEXT,
    "destino_seccion_id" TEXT,
    "lote_fabricacion" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fabricacion_alimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_fabricacion" (
    "id" TEXT NOT NULL,
    "fabricacion_id" TEXT NOT NULL,
    "tipo_insumo" TEXT NOT NULL,
    "cantidad_requerida_kg" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "detalle_fabricacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_vacunacion" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "tipo_vacuna" TEXT NOT NULL,
    "fecha_aplicacion" DATE NOT NULL,
    "via_aplicacion" TEXT NOT NULL,
    "dosis_ml" DECIMAL(6,2),
    "lote_vacuna" TEXT,
    "proveedor_vacuna" TEXT,
    "aplicado_por" TEXT,
    "observaciones" TEXT,

    CONSTRAINT "registro_vacunacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_tratamientos" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "medicamento" TEXT NOT NULL,
    "principio_activo" TEXT,
    "dosis" DECIMAL(10,2),
    "via_aplicacion" TEXT,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE,
    "periodo_retiro_horas" INTEGER,
    "motivo" TEXT,
    "responsable" TEXT,
    "venta_bloqueada" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registro_tratamientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "necropsias" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "aves_examinadas" INTEGER NOT NULL DEFAULT 1,
    "hallazgos_macroscopicos" TEXT,
    "hallazgos_organos" JSONB,
    "fotos" TEXT[],
    "diagnostico_presuntivo" TEXT,
    "diagnostico_confirmado" TEXT,
    "laboratorio" TEXT,
    "realizada_por" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "necropsias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_visitas" (
    "id" TEXT NOT NULL,
    "visitante_nombre" TEXT NOT NULL,
    "visitante_empresa" TEXT,
    "visitante_rut" TEXT,
    "fecha_visita" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultima_visita_otra_granja" DATE,
    "periodo_cuarentena_cumplido" BOOLEAN NOT NULL DEFAULT false,
    "vehiculo_placa" TEXT,
    "vehiculo_desinfectado" BOOLEAN NOT NULL DEFAULT false,
    "firma_digital" TEXT,
    "autorizado_por" TEXT,
    "observaciones" TEXT,

    CONSTRAINT "registro_visitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checklist_bioseguridad" (
    "id" TEXT NOT NULL,
    "galpon_id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "lote_id" TEXT,
    "pediluvios_activos" BOOLEAN,
    "cortinas_buen_estado" BOOLEAN,
    "mallas_aves_silvestres" BOOLEAN,
    "ausencia_roedores" BOOLEAN,
    "ausencia_moscas_excesivas" BOOLEAN,
    "rodaluvio_funcional" BOOLEAN,
    "cerco_perimetral_intacto" BOOLEAN,
    "observaciones" TEXT,
    "registrado_por" TEXT,

    CONSTRAINT "checklist_bioseguridad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "control_calidad_huevo" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "muestra_id" INTEGER,
    "peso_promedio_gramos" DECIMAL(5,2),
    "unidad_haugh" DECIMAL(5,1),
    "color_yema" INTEGER,
    "resistencia_cascara_kgf" DECIMAL(4,2),
    "ph_clara" DECIMAL(4,2),
    "ph_yema" DECIMAL(4,2),
    "camara_aire_mm" DECIMAL(4,2),
    "observaciones" TEXT,
    "registrado_por" TEXT,

    CONSTRAINT "control_calidad_huevo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trazabilidad" (
    "id" TEXT NOT NULL,
    "codigo_envase" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "seccion_id" TEXT,
    "galpon_id" TEXT,
    "fecha_postura" DATE NOT NULL,
    "clasificacion" TEXT NOT NULL,
    "fecha_despacho" DATE,
    "certificado_sanitario" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trazabilidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formato_cajas" (
    "id" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "unidades_por_caja" INTEGER NOT NULL DEFAULT 180,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "formato_cajas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventario_packing" (
    "id" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "stock_cajas" INTEGER NOT NULL DEFAULT 0,
    "stock_unidades" INTEGER NOT NULL DEFAULT 0,
    "stock_minimo_cajas" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "inventario_packing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registro_packing" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "lote_id" TEXT NOT NULL,
    "seccion_id" TEXT NOT NULL,
    "huevos_sucio" INTEGER NOT NULL DEFAULT 0,
    "huevos_roto" INTEGER NOT NULL DEFAULT 0,
    "huevos_descarte" INTEGER NOT NULL DEFAULT 0,
    "cajas_jumbo" INTEGER NOT NULL DEFAULT 0,
    "cajas_super" INTEGER NOT NULL DEFAULT 0,
    "cajas_extra" INTEGER NOT NULL DEFAULT 0,
    "cajas_primera" INTEGER NOT NULL DEFAULT 0,
    "cajas_segunda" INTEGER NOT NULL DEFAULT 0,
    "cajas_tercera" INTEGER NOT NULL DEFAULT 0,
    "registrado_por" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registro_packing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "despachos" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "hora_salida" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chofer" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "vehiculo_patente" TEXT,
    "numero_guia" TEXT,
    "observaciones" TEXT,
    "registrado_por" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "despachos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_despacho" (
    "id" TEXT NOT NULL,
    "despacho_id" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "cantidad_cajas" INTEGER NOT NULL,
    "cantidad_unidades" INTEGER,

    CONSTRAINT "detalle_despacho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "almacenes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "ubicacion" TEXT,
    "responsable" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "almacenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventario_productos" (
    "id" TEXT NOT NULL,
    "almacen_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "sku" TEXT,
    "categoria" TEXT,
    "unidad_medida" TEXT NOT NULL,
    "stock_actual" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "stock_minimo" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "costo_promedio_unitario" DECIMAL(12,4),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "inventario_productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_inventario" (
    "id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "tipo_movimiento" TEXT NOT NULL,
    "cantidad" DECIMAL(12,2) NOT NULL,
    "saldo_anterior" DECIMAL(12,2),
    "saldo_nuevo" DECIMAL(12,2),
    "referencia_tipo" TEXT,
    "referencia_id" TEXT,
    "costo_unitario" DECIMAL(12,4),
    "lote_proveedor" TEXT,
    "observaciones" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventario_huevos" (
    "id" TEXT NOT NULL,
    "almacen_id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "clasificacion" TEXT NOT NULL,
    "cantidad_docenas" INTEGER NOT NULL,
    "fecha_produccion" DATE NOT NULL,
    "fecha_vencimiento" DATE,
    "stock_actual_docenas" INTEGER NOT NULL,
    "ubicacion" TEXT,

    CONSTRAINT "inventario_huevos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipos" (
    "id" TEXT NOT NULL,
    "galpon_id" TEXT,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "marca" TEXT,
    "modelo" TEXT,
    "numero_serie" TEXT,
    "fecha_instalacion" DATE,
    "frecuencia_mantencion_dias" INTEGER,
    "proxima_mantencion" DATE,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "observaciones" TEXT,

    CONSTRAINT "equipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mantenimiento" (
    "id" TEXT NOT NULL,
    "equipo_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "descripcion" TEXT NOT NULL,
    "repuestos_utilizados" TEXT,
    "costo" DECIMAL(10,2),
    "duracion_horas" DECIMAL(4,1),
    "responsable" TEXT,
    "proxima_fecha_sugerida" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mantenimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "costos_lote" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "tipo_costo" TEXT NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "fecha" DATE NOT NULL,
    "categoria" TEXT,
    "descripcion" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "costos_lote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumen_lote" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "costo_total_alimento" DECIMAL(12,2),
    "costo_total_pollitas" DECIMAL(12,2),
    "costo_total_operativo" DECIMAL(12,2),
    "ingreso_total_huevos" DECIMAL(12,2),
    "ingreso_total_gallinaza" DECIMAL(12,2),
    "ingreso_venta_descarte" DECIMAL(12,2),
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "resumen_lote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presupuestos" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT,
    "galpon_id" TEXT,
    "anio" INTEGER NOT NULL,
    "tipo" TEXT,
    "partidas" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "presupuestos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "residuos" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "hora_salida" TIMESTAMPTZ,
    "tipo" TEXT NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "unidad" TEXT NOT NULL,
    "metodo_disposicion" TEXT,
    "transportista" TEXT,
    "patente_vehiculo" TEXT,
    "destino_detalle" TEXT,
    "ingreso" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "costo_disposicion" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "observaciones" TEXT,

    CONSTRAINT "residuos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curvas_estandar" (
    "id" TEXT NOT NULL,
    "linea_genetica" TEXT NOT NULL,
    "semana_vida" INTEGER NOT NULL,
    "postura_esperada" DECIMAL(5,2),
    "mortalidad_esperada" DECIMAL(5,2),
    "consumo_esperado_gramos" DECIMAL(6,2),
    "peso_huevo_esperado" DECIMAL(5,2),
    "peso_corporal_esperado" DECIMAL(6,2),

    CONSTRAINT "curvas_estandar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_alertas" (
    "id" TEXT NOT NULL,
    "lote_id" TEXT,
    "tipo_alerta" TEXT NOT NULL,
    "umbral_min" DECIMAL(10,2),
    "umbral_max" DECIMAL(10,2),
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "canal_notificacion" TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "configuracion_alertas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "secciones_galpon_id_nombre_key" ON "secciones"("galpon_id", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "lotes_codigo_lote_key" ON "lotes"("codigo_lote");

-- CreateIndex
CREATE UNIQUE INDEX "registro_diario_seccion_id_fecha_key" ON "registro_diario"("seccion_id", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "consumo_agua_lote_id_fecha_key" ON "consumo_agua"("lote_id", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "programa_iluminacion_lote_id_semana_vida_key" ON "programa_iluminacion"("lote_id", "semana_vida");

-- CreateIndex
CREATE UNIQUE INDEX "registro_iluminacion_diario_lote_id_fecha_key" ON "registro_iluminacion_diario"("lote_id", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "registros_ambientales_seccion_id_fecha_hora_key" ON "registros_ambientales"("seccion_id", "fecha_hora");

-- CreateIndex
CREATE UNIQUE INDEX "consumo_alimento_diario_lote_id_fecha_tipo_alimento_key" ON "consumo_alimento_diario"("lote_id", "fecha", "tipo_alimento");

-- CreateIndex
CREATE UNIQUE INDEX "stock_insumos_tipo_insumo_key" ON "stock_insumos"("tipo_insumo");

-- CreateIndex
CREATE UNIQUE INDEX "checklist_bioseguridad_galpon_id_fecha_key" ON "checklist_bioseguridad"("galpon_id", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "trazabilidad_codigo_envase_key" ON "trazabilidad"("codigo_envase");

-- CreateIndex
CREATE UNIQUE INDEX "formato_cajas_categoria_key" ON "formato_cajas"("categoria");

-- CreateIndex
CREATE UNIQUE INDEX "inventario_packing_categoria_key" ON "inventario_packing"("categoria");

-- CreateIndex
CREATE UNIQUE INDEX "registro_packing_lote_id_seccion_id_fecha_key" ON "registro_packing"("lote_id", "seccion_id", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "detalle_despacho_despacho_id_categoria_key" ON "detalle_despacho"("despacho_id", "categoria");

-- CreateIndex
CREATE UNIQUE INDEX "inventario_productos_sku_key" ON "inventario_productos"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "resumen_lote_lote_id_key" ON "resumen_lote"("lote_id");

-- CreateIndex
CREATE UNIQUE INDEX "curvas_estandar_linea_genetica_semana_vida_key" ON "curvas_estandar"("linea_genetica", "semana_vida");

-- AddForeignKey
ALTER TABLE "secciones" ADD CONSTRAINT "secciones_galpon_id_fkey" FOREIGN KEY ("galpon_id") REFERENCES "galpones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lotes" ADD CONSTRAINT "lotes_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "secciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_lote" ADD CONSTRAINT "eventos_lote_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_diario" ADD CONSTRAINT "registro_diario_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_diario" ADD CONSTRAINT "registro_diario_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "secciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muestreo_peso" ADD CONSTRAINT "muestreo_peso_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumo_agua" ADD CONSTRAINT "consumo_agua_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumo_agua" ADD CONSTRAINT "consumo_agua_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "secciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programa_iluminacion" ADD CONSTRAINT "programa_iluminacion_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_iluminacion_diario" ADD CONSTRAINT "registro_iluminacion_diario_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_iluminacion_diario" ADD CONSTRAINT "registro_iluminacion_diario_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "secciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_ambientales" ADD CONSTRAINT "registros_ambientales_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_ambientales" ADD CONSTRAINT "registros_ambientales_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "secciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumo_alimento_diario" ADD CONSTRAINT "consumo_alimento_diario_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumo_alimento_diario" ADD CONSTRAINT "consumo_alimento_diario_formula_id_fkey" FOREIGN KEY ("formula_id") REFERENCES "formulas_alimento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fabricacion_alimento" ADD CONSTRAINT "fabricacion_alimento_formula_id_fkey" FOREIGN KEY ("formula_id") REFERENCES "formulas_alimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_fabricacion" ADD CONSTRAINT "detalle_fabricacion_fabricacion_id_fkey" FOREIGN KEY ("fabricacion_id") REFERENCES "fabricacion_alimento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_vacunacion" ADD CONSTRAINT "registro_vacunacion_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_tratamientos" ADD CONSTRAINT "registro_tratamientos_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "necropsias" ADD CONSTRAINT "necropsias_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_bioseguridad" ADD CONSTRAINT "checklist_bioseguridad_galpon_id_fkey" FOREIGN KEY ("galpon_id") REFERENCES "galpones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "control_calidad_huevo" ADD CONSTRAINT "control_calidad_huevo_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazabilidad" ADD CONSTRAINT "trazabilidad_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_packing" ADD CONSTRAINT "registro_packing_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_packing" ADD CONSTRAINT "registro_packing_seccion_id_fkey" FOREIGN KEY ("seccion_id") REFERENCES "secciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_despacho" ADD CONSTRAINT "detalle_despacho_despacho_id_fkey" FOREIGN KEY ("despacho_id") REFERENCES "despachos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario_productos" ADD CONSTRAINT "inventario_productos_almacen_id_fkey" FOREIGN KEY ("almacen_id") REFERENCES "almacenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "movimientos_inventario_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "inventario_productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario_huevos" ADD CONSTRAINT "inventario_huevos_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipos" ADD CONSTRAINT "equipos_galpon_id_fkey" FOREIGN KEY ("galpon_id") REFERENCES "galpones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mantenimiento" ADD CONSTRAINT "mantenimiento_equipo_id_fkey" FOREIGN KEY ("equipo_id") REFERENCES "equipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "costos_lote" ADD CONSTRAINT "costos_lote_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumen_lote" ADD CONSTRAINT "resumen_lote_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presupuestos" ADD CONSTRAINT "presupuestos_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residuos" ADD CONSTRAINT "residuos_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
