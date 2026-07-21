# Especificación Técnica: Sistema de Gestión Avícola para Postura

**Versión:** 2.0
**Estado:** En revisión
**Última actualización:** 2026-07-19

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14+ con App Router y TypeScript |
| Estilos | Tailwind CSS + shadcn/ui |
| Gráficos | Recharts + D3.js (visualizaciones complejas) |
| Backend | Next.js API Routes + Server Actions |
| Base de Datos | Neon (PostgreSQL serverless) + Prisma ORM |
| Autenticación | NextAuth.js v5 (Auth.js) |
| Almacenamiento | Vercel Blob Storage (evidencia fotográfica) |
| Tiempo Real | WebSockets (Socket.io o Server-Sent Events) |
| PWA | next-pwa (service workers + IndexedDB) |
| Validación | Zod (schemas frontend/backend) |
| Cola de Tareas | Inngest o BullMQ |
| Cache | Upstash Redis |
| Despliegue | Vercel |

---

## Roles de Usuario y Permisos

| Rol | Responsabilidad | Acceso |
|-----|----------------|--------|
| **Admin** | Dueño / Gerente general | Todo el sistema |
| **Supervisor** | Jefe de producción | Gestión de lotes, métricas, personal a cargo |
| **Galponero** | Encargado de galpón | Registro diario, lectura de consumo, alertas |
| **Bodeguero** | Control de inventarios | Almacenes, recepción, transferencias |
| **Contador** | Gestión financiera | Costos, cuentas, facturación |
| **Veterinario** | Sanidad | Vacunas, tratamientos, necropsias, bioseguridad |

---

## Jerarquía de la Granja (una sola granja)

```
Granja (implícita - único establecimiento)
  └── Galpón (edificio / nave / unidad productiva)
        └── Sección (división del galpón: ala, fila, batería, nivel)
              └── Lote (grupo de aves de la misma edad y línea genética)
```

**Reglas:**
- Un galpón tiene 1 o más secciones
- Una sección pertenece a un único galpón
- Un lote ocupa una o más secciones (pero una sección tiene solo 1 lote activo a la vez)
- El registro diario, consumo de agua y variables ambientales se capturan por sección

---

## Módulos Funcionales

### 1. Gestión de Lotes y Ciclo de Vida

#### 1.1 Recepción de Pollitas BB
- Registro de llegada: proveedor, línea genética, cantidad, fecha de nacimiento, peso inicial
- Asignación a galpón (a través de sección)
- Costo unitario y total del lote

#### 1.2 Período de Cría y Recría (semana 0-16)
- Programa de alimentación diferenciado (inicio, crecimiento, pre-postura)
- Curva de peso corporal esperada vs real
- Uniformidad del lote (muestreo semanal)
- Manejo de iluminación y temperatura específica para cada edad

#### 1.3 Período de Postura (semana 17-90+)
- Curva de postura diaria vs curva estándar de la línea genética
- Seguimiento de peso de huevo por semana
- Registro de eventos: muda forzada, estrés calórico, picos de producción

#### 1.4 Cierre y Descarte del Lote
- Registro de salida: fecha, motivo (baja postura, edad, enfermedad), destino
- Peso total de venta, precio, comprador
- Cálculo de huevos totales producidos por ave alojada
- Resumen económico final del lote (ROI total)

#### Tablas
```sql
CREATE TABLE lotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_lote VARCHAR(50) NOT NULL UNIQUE,
  seccion_id UUID NOT NULL REFERENCES secciones(id),
  linea_genetica VARCHAR(100) NOT NULL,
  proveedor_pollita VARCHAR(200),
  cantidad_inicial INTEGER NOT NULL,
  fecha_recepcion DATE NOT NULL,
  fecha_nacimiento DATE,
  peso_inicial_promedio DECIMAL(5,2),
  costo_pollita_unitario DECIMAL(10,2),
  estado VARCHAR(20) NOT NULL DEFAULT 'activo', -- 'cria', 'recria', 'postura', 'descarte', 'cerrado'
  fecha_cierre DATE,
  motivo_cierre TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE galpones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) DEFAULT 'jaula', -- 'jaula', 'piso', 'pastoreo'
  capacidad_maxima INTEGER,
  activo BOOLEAN DEFAULT true
);

CREATE TABLE secciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  galpon_id UUID NOT NULL REFERENCES galpones(id),
  nombre VARCHAR(100) NOT NULL, -- ej: "Fila A", "Ala Norte", "Nivel 1"
  codigo VARCHAR(20), -- ej: "G1-FA", "G1-AN"
  capacidad_maxima INTEGER,
  activo BOOLEAN DEFAULT true,
  UNIQUE(galpon_id, nombre)
);

CREATE TABLE eventos_lote (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id),
  tipo_evento VARCHAR(50) NOT NULL, -- 'cambio_alimento', 'vacunacion', 'estres_calorico',
                                      -- 'muda_forzada', 'corte_pico', 'pesaje', 'otro'
  fecha DATE NOT NULL,
  descripcion TEXT,
  foto_url TEXT,
  created_by UUID REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Registro Diario de Producción

#### 2.1 Registro por Sección
- Fecha, lote, galpón (derivado de sección), sección
- Aves vivas, aves muertas (bajas del día)
- Huevos producidos (total y por clasificación)
- Consumo de alimento (kg)
- Consumo de agua (litros o lectura de medidor)
- Temperatura máxima y mínima
- Observaciones

#### 2.2 Optimizaciones Mobile
- Teclado numérico por defecto
- Botones +/- grandes para ajuste rápido
- Captura de voz (Web Speech API) para notas
- Foto del registro físico (comprobante)
- Offline-first con sincronización posterior

```sql
CREATE TABLE registro_diario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id),
  seccion_id UUID NOT NULL REFERENCES secciones(id),
  fecha DATE NOT NULL,
  aves_vivas INTEGER,
  bajas_dia INTEGER,
  huevos_producidos INTEGER,
  huevos_jumbo INTEGER DEFAULT 0,
  huevos_super INTEGER DEFAULT 0,
  huevos_extra INTEGER DEFAULT 0,
  huevos_primera INTEGER DEFAULT 0,
  huevos_segunda INTEGER DEFAULT 0,
  huevos_tercera INTEGER DEFAULT 0,
  huevos_subproducto INTEGER DEFAULT 0,
  consumo_alimento_kg DECIMAL(10,2),
  consumo_agua_litros DECIMAL(10,2),
  lectura_medidor_agua DECIMAL(10,2),
  temperatura_min DECIMAL(4,1),
  temperatura_max DECIMAL(4,1),
  observaciones TEXT,
  foto_registro TEXT,
  registrado_por UUID REFERENCES usuarios(id),
  sincronizado BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(seccion_id, fecha)
);
```

#### 2.3 Peso Corporal y Uniformidad (Muestreo)
```sql
CREATE TABLE muestreo_peso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id),
  fecha DATE NOT NULL,
  aves_muestreadas INTEGER NOT NULL,
  peso_promedio_gramos DECIMAL(6,2) NOT NULL,
  uniformidad_porcentaje DECIMAL(5,2), -- % de aves dentro de ±10% del promedio
  cv DECIMAL(5,2), -- coeficiente de variación
  peso_min DECIMAL(6,2),
  peso_max DECIMAL(6,2),
  observaciones TEXT
);
```

### 3. Monitoreo de Consumo de Agua

#### Importancia
La caída en consumo de agua es el primer indicador de enfermedad (24-48h antes que síntomas visibles). Es el sensor más sensible del galpón.

#### Funcionalidad
- Registro diario de consumo (litros/ave/día)
- Lectura de medidores de agua por sección
- Gráfico de tendencia con alertas por desviación >20%
- Rango esperado: 200-300 ml/ave/día (varía con temperatura y edad)
- Correlación: consumo agua vs consumo alimento (ratio esperado 1.8:1 a 2.2:1)

#### Tabla adicional
```sql
CREATE TABLE consumo_agua (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id),
  seccion_id UUID REFERENCES secciones(id),
  fecha DATE NOT NULL,
  lectura_medidor DECIMAL(10,2), -- lectura directa del medidor en m³
  litros_consumidos DECIMAL(10,2),
  aves_periodo INTEGER, -- aves promedio en el período
  litros_ave_dia DECIMAL(6,2) GENERATED ALWAYS AS (
    CASE WHEN aves_periodo > 0 THEN (litros_consumidos * 1000) / aves_periodo ELSE NULL END
  ) STORED,
  observaciones TEXT,
  UNIQUE(lote_id, fecha)
);
```

### 4. Programa de Iluminación

#### Importancia
El fotoperíodo es el estímulo principal para la producción de huevo en gallinas de postura. Un programa incorrecto causa baja postura y problemas de comportamiento.

#### Funcionalidad
- Tabla con programa por edad del lote (horas de luz, intensidad en lux, hora de encendido/apagado)
- Programa real registrado vs programa planificado
- Alertas si no se respeta el programa (especialmente en semanas críticas 16-18)
- Curva de iluminación recomendada por línea genética

#### Tablas
```sql
CREATE TABLE programa_iluminacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id),
  semana_vida INTEGER NOT NULL CHECK (semana_vida >= 1),
  horas_luz DECIMAL(4,2) NOT NULL, -- ej: 14.5
  intensidad_lux INTEGER, -- ej: 20
  hora_encendido TIME,
  hora_apagado TIME,
  tipo_periodo VARCHAR(20) DEFAULT 'postura', -- 'cria', 'recria', 'postura', 'muda'
  UNIQUE(lote_id, semana_vida)
);

CREATE TABLE registro_iluminacion_diario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id),
  seccion_id UUID REFERENCES secciones(id),
  fecha DATE NOT NULL,
  horas_luz_reales DECIMAL(4,2),
  hora_encendido_real TIME,
  hora_apagado_real TIME,
  intensidad_lux INTEGER,
  observaciones TEXT,
  UNIQUE(lote_id, fecha)
);
```

### 5. Control Ambiental (IoT)

#### Variables Monitoreadas
- Temperatura (°C) - rango óptimo 18-24°C en postura
- Humedad Relativa (%) - rango óptimo 50-70%
- Amoníaco (NH₃) - máximo recomendado <10 ppm, crítico >25 ppm
- Velocidad del aire (m/s)
- CO₂ (ppm)

#### Funcionalidad
- Registro manual o automático (integración con sensores)
- Alertas por variable fuera de rango
- Gráfico de tendencias por sección
- Correlación temperatura vs producción

```sql
CREATE TABLE registros_ambientales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id),
  seccion_id UUID NOT NULL REFERENCES secciones(id),
  fecha_hora TIMESTAMP NOT NULL DEFAULT NOW(),
  temperatura DECIMAL(4,1),
  humedad DECIMAL(4,1),
  amoniaco_ppm DECIMAL(5,1),
  co2_ppm DECIMAL(6,1),
  velocidad_aire_ms DECIMAL(4,2),
  fuente VARCHAR(20) DEFAULT 'manual', -- 'manual', 'sensor_iot', 'api_externa'
  UNIQUE(seccion_id, fecha_hora)
);
```

### 6. Alimentación y Nutrición

#### 6.1 Tipos de Alimento por Fase
- Pre-inicio (0-6 semanas): crumble
- Inicio (6-12 semanas): pellet
- Crecimiento (12-16 semanas): pellet
- Pre-postura (16-18 semanas): pellet/harina
- Postura Fase 1 (18-45 semanas): harina
- Postura Fase 2 (45-60 semanas): harina
- Postura Fase 3 (60+ semanas): harina

#### 6.2 Fórmulas y Raciones
- Tabla `formulas_alimento`: ingredientes, porcentajes, costo estimado
- Consumo esperado vs real por fase
- Conversión alimenticia (kg alimento / kg huevo) - objetivo 2.0-2.2

#### 6.3 Consumo y Stock
- Integración con módulo de inventarios (descuento automático al registrar consumo diario)
- Alertas de stock bajo por tipo de alimento
- Trazabilidad: lote de alimento → proveedor → fecha fabricación

#### 6.4 Fábrica de Alimentos y Traza de Insumos

**Recepción de Insumos:**
- Registro de materia prima recibida: maíz, soya, conchuela, vitaminas, harinilla, minerales, calcio, etc.
- Datos obligatorios: fecha de llegada, proveedor, vehículo transportista, patente, tipo de producto, cantidad en kg, **N° de Lote** y **N° de Guía**
- Al confirmar, suma automáticamente al `stock_insumos`

**Fabricación de Alimento:**
- Seleccionar fórmula → ingresar cantidad a producir (kg)
- El sistema calcula automáticamente las proporciones de cada insumo y descuenta del `stock_insumos`
- Registro de destino: galpón / sección a la que va dirigido el alimento
- Generación automática de `lote_fabricacion`

**Alertas:**
- Stock de insumo bajo mínimo configurabil
- Trazabilidad completa: guía → lote insumo → lote fabricación → consumo por lote de gallinas

#### Tablas
```sql
CREATE TABLE formulas_alimento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  tipo_alimento VARCHAR(50) NOT NULL,
  ingredientes JSONB NOT NULL, -- [{"ingrediente": "maiz", "porcentaje": 62.5}, ...]
  costo_kg_estimado DECIMAL(8,4),
  proteina_bruta DECIMAL(5,2),
  energia_metabolizable DECIMAL(6,2),
  activo BOOLEAN DEFAULT true
);

CREATE TABLE consumo_alimento_diario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id),
  fecha DATE NOT NULL,
  tipo_alimento VARCHAR(50) NOT NULL,
  cantidad_kg DECIMAL(10,2) NOT NULL,
  formula_id UUID REFERENCES formulas_alimento(id),
  inventario_movimiento_id UUID,
  UNIQUE(lote_id, fecha, tipo_alimento)
);

CREATE TABLE recepcion_insumos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha_llegada DATE NOT NULL,
  proveedor VARCHAR(200) NOT NULL,
  vehiculo VARCHAR(100),
  patente VARCHAR(20),
  tipo_insumo VARCHAR(50) NOT NULL, -- 'maiz', 'soya', 'conchuela', 'vitaminas', 'harinilla', 'calcio', 'minerales'
  cantidad_kg DECIMAL(12,2) NOT NULL,
  numero_lote VARCHAR(100) NOT NULL,
  numero_guia VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE stock_insumos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_insumo VARCHAR(50) NOT NULL UNIQUE,
  stock_actual_kg DECIMAL(12,2) NOT NULL DEFAULT 0,
  stock_minimo_kg DECIMAL(12,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fabricacion_alimento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE NOT NULL,
  formula_id UUID NOT NULL REFERENCES formulas_alimento(id),
  cantidad_producida_kg DECIMAL(12,2) NOT NULL,
  destino_galpon_id UUID REFERENCES galpones(id),
  destino_seccion_id UUID REFERENCES secciones(id),
  lote_fabricacion VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE detalle_fabricacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fabricacion_id UUID NOT NULL REFERENCES fabricacion_alimento(id),
  tipo_insumo VARCHAR(50) NOT NULL,
  cantidad_requerida_kg DECIMAL(12,2) NOT NULL
);
```

### 7. Módulo Sanitario y Bioseguridad

#### 7.1 Vacunación
- Programa de vacunación por línea genética
- Registro de aplicación: tipo vacuna, lote, vía (ocular, IM, SC, agua de bebida), dosis
- Alertas de próxima vacunación programada

#### 7.2 Tratamientos y Periodo de Retiro
- Registro de medicamentos: producto, dosis, vía, duración
- **Periodo de retiro**: bloqueo automático de venta de huevos y carne
- Contador regresivo visible en dashboard
- Liberación automática al cumplir el periodo

#### 7.3 Necropsias y Diagnóstico
- Registro de hallazgos por órgano
- Fotos (integración Vercel Blob)
- Diagnóstico presuntivo y confirmado (laboratorio)
- Tasa de necropsia sugerida: mínimo 3-5 aves/semana por galpón

#### 7.4 Bioseguridad y Accesos
- **Registro de visitas**: nombre, empresa, procedencia, última visita a otra granja, firma
- **Período de cuarentena**: 48-72h sin contacto con otras aves
- **Control vehicular**: desinfección de llantas, registro de placa
- **Checklist diario de bioseguridad** por galpón:
  - Pediluvios con desinfectante activo
  - Cortinas y mallas en buen estado
  - Rodaluvio vehicular funcional
  - Ausencia de plagas (roedores, moscas)
- **Bloqueo inteligente**: alerta si visitante estuvo en otra granja <48h

#### Tablas adicionales
```sql
CREATE TABLE registro_vacunacion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id),
  tipo_vacuna VARCHAR(100) NOT NULL,
  fecha_aplicacion DATE NOT NULL,
  via_aplicacion VARCHAR(50) NOT NULL, -- 'ocular', 'im', 'sc', 'agua_bebida', 'subcutanea'
  dosis_ml DECIMAL(6,2),
  lote_vacuna VARCHAR(100),
  proveedor_vacuna VARCHAR(200),
  aplicado_por UUID REFERENCES usuarios(id),
  observaciones TEXT
);

CREATE TABLE registro_tratamientos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id),
  medicamento VARCHAR(100) NOT NULL,
  principio_activo VARCHAR(100),
  dosis DECIMAL(10,2),
  via_aplicacion VARCHAR(50),
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  periodo_retiro_horas INTEGER, -- horas sin venta de huevos tras último tratamiento
  fecha_fin_retiro DATE GENERATED ALWAYS AS (fecha_fin + periodo_retiro_horas / 24) STORED,
  motivo TEXT,
  responsable UUID REFERENCES usuarios(id),
  venta_bloqueada BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE necropsias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id),
  fecha DATE NOT NULL,
  aves_examinadas INTEGER DEFAULT 1,
  hallazgos_macroscopicos TEXT,
  hallazgos_organos JSONB, -- {"higado": "aumentado_tamano", "pulmones": "congestionados", ...}
  fotos TEXT[], -- array de URLs de Vercel Blob
  diagnostico_presuntivo VARCHAR(200),
  diagnostico_confirmado VARCHAR(200),
  laboratorio VARCHAR(100),
  realizada_por UUID REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE registro_visitas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitante_nombre VARCHAR(200) NOT NULL,
  visitante_empresa VARCHAR(200),
  visitante_rut VARCHAR(20),
  fecha_visita TIMESTAMP NOT NULL DEFAULT NOW(),
  ultima_visita_otra_granja DATE,
  periodo_cuarentena_cumplido BOOLEAN DEFAULT false,
  vehiculo_placa VARCHAR(20),
  vehiculo_desinfectado BOOLEAN DEFAULT false,
  firma_digital TEXT,
  autorizado_por UUID REFERENCES usuarios(id),
  observaciones TEXT
);

CREATE TABLE checklist_bioseguridad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  galpon_id UUID NOT NULL REFERENCES galpones(id),
  fecha DATE NOT NULL,
  lote_id UUID REFERENCES lotes(id),
  pediluvios_activos BOOLEAN,
  cortinas_buen_estado BOOLEAN,
  mallas_aves_silvestres BOOLEAN,
  ausencia_roedores BOOLEAN,
  ausencia_moscas_excesivas BOOLEAN,
  rodaluvio_funcional BOOLEAN,
  cerco_perimetral_intacto BOOLEAN,
  observaciones TEXT,
  registrado_por UUID REFERENCES usuarios(id),
  UNIQUE(galpon_id, fecha)
);
```

### 8. Calidad de Huevo y Trazabilidad

#### 8.1 Clasificación por Calibre (Norma Chile / Internacional)

| Categoría | Peso (g) | Tipo |
|-----------|----------|------|
| Jumbo | ≥68 | Consumo |
| Super | 65-67 | Consumo |
| Extra | 61-64 | Consumo |
| Primera | 55-60 | Consumo |
| Segunda | 50-54 | Consumo |
| Tercera | <50 | Consumo |
| Subproducto | variable | Industria / Quebrado |

#### 8.2 Control de Calidad
- Prueba de frescura (unidad Haugh)
- Color de yema (abanico DSM)
- Resistencia de cáscara (kgf)
- pH de clara y yema
- Cámara de aire (mm)

#### 8.3 Trazabilidad (Farm-to-Table)
- Cada envase/código trazable: sección → galpón → lote → fecha de postura → clasificación → cliente
- Enlace directo desde el empaque al sistema

```sql
CREATE TABLE trazabilidad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_envase VARCHAR(100) NOT NULL UNIQUE,
  lote_id UUID NOT NULL REFERENCES lotes(id),
  seccion_id UUID REFERENCES secciones(id),
  galpon_id UUID REFERENCES galpones(id),
  fecha_postura DATE NOT NULL,
  clasificacion VARCHAR(20) NOT NULL,
  fecha_despacho DATE,
  certificado_sanitario TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE control_calidad_huevo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id),
  fecha DATE NOT NULL,
  muestra_id INTEGER,
  peso_promedio_gramos DECIMAL(5,2),
  unidad_haugh DECIMAL(5,1),
  color_yema INTEGER, -- escala DSM 1-15
  resistencia_cascara_kgf DECIMAL(4,2),
  ph_clara DECIMAL(4,2),
  ph_yema DECIMAL(4,2),
  camara_aire_mm DECIMAL(4,2),
  observaciones TEXT
);
```

### 9. Packing y Clasificación de Huevos

#### 9.1 Registro Diario de Packing
- Registro diario de la producción procesada en la planta de packing
- Clasificación por tipo: huevo sucio, huevo roto, descarte
- Clasificación por calibre estándar: Jumbo, Super, Extra, Primera, Segunda, Tercera
- **Registro por cajas**: ingreso de cantidad de cajas por categoría con formato configurable:
  - Extra y Primera: **180 unidades por caja**
  - Súper: **100 unidades por caja**
  - Jumbo, Segunda, Tercera: formato unitario o configurable
- El sistema calcula automáticamente: `cajas × unidades_por_caja = unidades totales`
- Acumulado diario: los ingresos en cajas y unidades se suman automáticamente al inventario de packing

#### 9.2 Inventario de Packing (Stock Acumulado)
- Tabla `inventario_packing` que lleva el stock en tiempo real por categoría
- **Entradas**: registros de packing del día (unidades + cajas)
- **Salidas**: despachos registrados (descuento automático)
- Stock mínimo configurable por categoría para alertas de reposición

#### 9.3 Descuento Automático de Inventario
- Al confirmar el registro de packing:
  1. Descuenta los huevos procesados del `registro_diario` de la sección
  2. Suma cajas y unidades al `inventario_packing` por categoría
  3. Registra huevos sucios/rotos/descarte como merma

#### Tablas
```sql
CREATE TABLE formato_cajas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria VARCHAR(30) NOT NULL UNIQUE, -- 'jumbo', 'super', 'extra', 'primera', 'segunda', 'tercera'
  unidades_por_caja INTEGER NOT NULL DEFAULT 1,
  activo BOOLEAN DEFAULT true
);

INSERT INTO formato_cajas (categoria, unidades_por_caja) VALUES
  ('jumbo', 180), ('super', 100), ('extra', 180),
  ('primera', 180), ('segunda', 180), ('tercera', 180);

CREATE TABLE inventario_packing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria VARCHAR(30) NOT NULL UNIQUE, -- 'jumbo', 'super', 'extra', 'primera', 'segunda', 'tercera'
  stock_cajas INTEGER NOT NULL DEFAULT 0,
  stock_unidades INTEGER NOT NULL DEFAULT 0,
  stock_minimo_cajas INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE registro_packing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE NOT NULL,
  lote_id UUID NOT NULL REFERENCES lotes(id),
  seccion_id UUID NOT NULL REFERENCES secciones(id),
  -- No clasificables (siempre en unidades)
  huevos_sucio INTEGER DEFAULT 0,
  huevos_roto INTEGER DEFAULT 0,
  huevos_descarte INTEGER DEFAULT 0,
  -- Clasificación estándar (en cajas + unidades)
  cajas_jumbo INTEGER DEFAULT 0,
  unidades_jumbo INTEGER GENERATED ALWAYS AS (cajas_jumbo * (SELECT COALESCE(unidades_por_caja,1) FROM formato_cajas WHERE categoria='jumbo')) STORED,
  cajas_super INTEGER DEFAULT 0,
  unidades_super INTEGER GENERATED ALWAYS AS (cajas_super * (SELECT COALESCE(unidades_por_caja,1) FROM formato_cajas WHERE categoria='super')) STORED,
  cajas_extra INTEGER DEFAULT 0,
  unidades_extra INTEGER GENERATED ALWAYS AS (cajas_extra * (SELECT COALESCE(unidades_por_caja,1) FROM formato_cajas WHERE categoria='extra')) STORED,
  cajas_primera INTEGER DEFAULT 0,
  unidades_primera INTEGER GENERATED ALWAYS AS (cajas_primera * (SELECT COALESCE(unidades_por_caja,1) FROM formato_cajas WHERE categoria='primera')) STORED,
  cajas_segunda INTEGER DEFAULT 0,
  unidades_segunda INTEGER GENERATED ALWAYS AS (cajas_segunda * (SELECT COALESCE(unidades_por_caja,1) FROM formato_cajas WHERE categoria='segunda')) STORED,
  cajas_tercera INTEGER DEFAULT 0,
  unidades_tercera INTEGER GENERATED ALWAYS AS (cajas_tercera * (SELECT COALESCE(unidades_por_caja,1) FROM formato_cajas WHERE categoria='tercera')) STORED,
  -- Totales calculados
  total_procesado INTEGER GENERATED ALWAYS AS (
    COALESCE(huevos_sucio,0) + COALESCE(huevos_roto,0) + COALESCE(huevos_descarte,0) +
    COALESCE(unidades_jumbo,0) + COALESCE(unidades_super,0) + COALESCE(unidades_extra,0) +
    COALESCE(unidades_primera,0) + COALESCE(unidades_segunda,0) + COALESCE(unidades_tercera,0)
  ) STORED,
  total_clasificado INTEGER GENERATED ALWAYS AS (
    COALESCE(unidades_jumbo,0) + COALESCE(unidades_super,0) + COALESCE(unidades_extra,0) +
    COALESCE(unidades_primera,0) + COALESCE(unidades_segunda,0) + COALESCE(unidades_tercera,0)
  ) STORED,
  registrado_por UUID REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(lote_id, seccion_id, fecha)
);
```

### 10. Despacho y Salidas de Packing

#### 10.1 Registro de Despacho
- Al realizar una salida de inventario desde Packing, el sistema descuenta automáticamente las cajas y unidades del `inventario_packing`
- Datos requeridos en la guía/registro:
  - **Quién retira**: nombre del chofer o persona que retira
  - **Destino**: lugar hacia donde se envía el producto
  - **Cantidad y categorías**: detalle de cajas por categoría (el sistema calcula unidades automáticamente)
  - **Vehículo**: patente del vehículo (opcional)
  - **N° Guía**: número de guía de despacho (opcional)

#### 10.2 Control de Flujo Diario
- Balance diario: `stock_inicial + entradas_packing - salidas_despacho = stock_final`
- Reporte de existencias por categoría en tiempo real
- Alerta si stock cae bajo mínimo configurable

#### Tablas
```sql
CREATE TABLE despachos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE NOT NULL,
  hora_salida TIMESTAMP DEFAULT NOW(),
  chofer VARCHAR(200) NOT NULL,
  destino TEXT NOT NULL,
  vehiculo_patente VARCHAR(20),
  numero_guia VARCHAR(100),
  observaciones TEXT,
  registrado_por UUID REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE detalle_despacho (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  despacho_id UUID NOT NULL REFERENCES despachos(id),
  categoria VARCHAR(30) NOT NULL, -- 'jumbo', 'super', 'extra', 'primera', 'segunda', 'tercera'
  cantidad_cajas INTEGER NOT NULL CHECK (cantidad_cajas > 0),
  cantidad_unidades INTEGER GENERATED ALWAYS AS (
    cantidad_cajas * (SELECT COALESCE(unidades_por_caja,1) FROM formato_cajas WHERE categoria = detalle_despacho.categoria)
  ) STORED,
  UNIQUE(despacho_id, categoria)
);
```

### 11. Inventarios Multi-Almacén

#### 10.1 Tipos de Almacén
- Alimento (a granel, sacos)
- Insumos (vacunas, medicamentos, equipos)
- Producto terminado (huevos clasificados)
- Empaques (bandejas, cajas, envases)

#### 10.2 Movimientos y Auditoría
- Entradas: compras, devoluciones, producción
- Salidas: consumo, ventas, mermas
- Transferencias entre almacenes
- Ajustes con justificación y aprobación
- Trigger automático: cada registro de consumo diario descuenta del inventario

```sql
CREATE TABLE almacenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'alimento', 'insumos', 'huevos', 'empaques', 'general'
  ubicacion TEXT,
  responsable UUID REFERENCES usuarios(id),
  activo BOOLEAN DEFAULT true
);

CREATE TABLE inventario_productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  almacen_id UUID NOT NULL REFERENCES almacenes(id),
  nombre VARCHAR(200) NOT NULL,
  sku VARCHAR(50) UNIQUE,
  categoria VARCHAR(50), -- 'alimento', 'vacuna', 'medicamento', 'bandeja', 'caja', etc.
  unidad_medida VARCHAR(20) NOT NULL, -- 'kg', 'unidades', 'litros', 'docenas'
  stock_actual DECIMAL(12,2) NOT NULL DEFAULT 0,
  stock_minimo DECIMAL(12,2) DEFAULT 0,
  costo_promedio_unitario DECIMAL(12,4),
  activo BOOLEAN DEFAULT true
);

CREATE TABLE movimientos_inventario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producto_id UUID NOT NULL REFERENCES inventario_productos(id),
  tipo_movimiento VARCHAR(20) NOT NULL, -- 'entrada', 'salida', 'transferencia', 'ajuste'
  cantidad DECIMAL(12,2) NOT NULL,
  saldo_anterior DECIMAL(12,2),
  saldo_nuevo DECIMAL(12,2),
  referencia_tipo VARCHAR(50), -- 'compra', 'consumo_diario', 'pedido', 'ajuste'
  referencia_id UUID,
  costo_unitario DECIMAL(12,4),
  lote_proveedor VARCHAR(100),
  observaciones TEXT,
  created_by UUID REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE inventario_huevos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  almacen_id UUID NOT NULL REFERENCES almacenes(id),
  lote_id UUID NOT NULL REFERENCES lotes(id),
  clasificacion VARCHAR(20) NOT NULL, -- 'jumbo', 'super', 'extra', 'primera', 'segunda', 'tercera', 'subproducto'
  cantidad_docenas INTEGER NOT NULL,
  fecha_produccion DATE NOT NULL,
  fecha_vencimiento DATE, -- 30 días desde producción
  stock_actual_docenas INTEGER NOT NULL,
  ubicacion VARCHAR(100) -- cámara de frío, estante, etc.
);
```

### 12. Mantenimiento de Equipos e Infraestructura

#### 12.1 Equipos Registrados
| Equipo | Frecuencia Mantención |
|--------|----------------------|
| Comederos (cadena/plato) | Mensual |
| Bebederos (nipple/copa) | Semanal |
| Cortinas (automáticas) | Mensual |
| Extractores/ventiladores | Trimestral |
| Generador eléctrico | Mensual (prueba) |
| Nebulización / cooling | Trimestral |
| Sistema de alarma | Semanal |
| Básculas | Semestral |
| Clasificadora de huevos | Según fabricante |

#### 12.2 Mantenimiento Preventivo vs Correctivo
- Plan de mantenimiento programado
- Alertas 7 días antes del vencimiento
- Registro de costo, repuestos, tiempo invertido
- Historial por equipo

```sql
CREATE TABLE equipos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  galpon_id UUID REFERENCES galpones(id),
  nombre VARCHAR(200) NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'comedero', 'bebedero', 'ventilador', 'generador', 'cortina', 'alarma', etc.
  marca VARCHAR(100),
  modelo VARCHAR(100),
  numero_serie VARCHAR(100),
  fecha_instalacion DATE,
  frecuencia_mantencion_dias INTEGER,
  proxima_mantencion DATE,
  activo BOOLEAN DEFAULT true,
  observaciones TEXT
);

CREATE TABLE mantenimiento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipo_id UUID NOT NULL REFERENCES equipos(id),
  tipo VARCHAR(20) NOT NULL, -- 'preventivo', 'correctivo'
  fecha DATE NOT NULL,
  descripcion TEXT NOT NULL,
  repuestos_utilizados TEXT,
  costo DECIMAL(10,2),
  duracion_horas DECIMAL(4,1),
  responsable UUID REFERENCES usuarios(id),
  proxima_fecha_sugerida DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 13. Gestión de Residuos y Subproductos

#### 13.1 Gallinaza
- Producción estimada (kg/día o m³/día)
- Registro de retiro: fecha, cantidad, destino (venta, abono propio, compostaje)
- Precio de venta si aplica

#### 13.2 Aves Muertas
- Método de disposición: compostaje, incineración, fosa séptica, digestor
- Registro semanal: cantidad, peso estimado, método
- Costos de disposición

#### 13.3 Huevo Subproducto
- Destino: venta a industria, quebrado, donación, destrucción
- Registro de volumen y precio

```sql
CREATE TABLE residuos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id),
  fecha DATE NOT NULL,
  hora_salida TIMESTAMP, -- fecha + hora exacta de salida
  tipo VARCHAR(50) NOT NULL, -- 'gallinaza', 'aves_muertas', 'subproducto_huevo', 'otros'
  cantidad DECIMAL(10,2) NOT NULL,
  unidad VARCHAR(20) NOT NULL, -- 'kg', 'm3', 'unidades', 'docenas'
  metodo_disposicion VARCHAR(100), -- 'venta', 'compostaje', 'fosa', 'industria', etc.
  -- Datos de transporte (especialmente para gallinaza/guano)
  transportista VARCHAR(200),
  patente_vehiculo VARCHAR(20),
  destino_detalle TEXT,
  ingreso DECIMAL(10,2) DEFAULT 0, -- si se vende
  costo_disposicion DECIMAL(10,2) DEFAULT 0,
  observaciones TEXT
);
```

### 14. Presupuestos y Escenarios

#### 14.1 Presupuesto Anual
- Por lote, por galpón, por empresa
- Partidas: pollitas, alimento, vacunas, mano de obra, servicios, etc.
- Comparativa presupuesto vs real (en dashboard financiero)

#### 14.2 Simulador de Escenarios
- "¿Qué pasa si el maíz sube 15%?" → recalcular costo por huevo
- "¿Si la postura cae 5%?" → impacto en margen
- "¿Si extiendo el lote 10 semanas?" → rentabilidad marginal

```sql
CREATE TABLE presupuestos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID REFERENCES lotes(id),
  galpon_id UUID REFERENCES galpones(id),
  anio INTEGER NOT NULL,
  tipo VARCHAR(50), -- 'anual', 'por_lote', 'por_galpon'
  partidas JSONB NOT NULL, -- [{"concepto": "alimento", "presupuestado": 5000000, "real": ...}]
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 15. Alertas y Notificaciones Inteligentes

#### 15.1 Reglas de Alerta

| Alerta | Cálculo | Severidad |
|--------|---------|-----------|
| Caída de postura | >5% en 2 días consecutivos | Alta |
| Mortalidad diaria | >0.1% del lote | Alta |
| Consumo alimento | ±15% fuera de rango esperado | Alta |
| Consumo agua | Caída >20% respecto a promedio 3 días | Crítica |
| Temperatura | >28°C o <16°C en postura | Alta |
| Amoníaco | >15 ppm | Alta |
| Stock alimento | Bajo mínimo configurable | Media |
| Vacunación | Fecha próxima programada | Media |
| Mantenimiento | Equipo vencido | Baja |
| Periodo de retiro | Activo con ventas pendientes | Crítica |
| Uniformidad | <75% en recría | Alta |

#### 15.2 Canales
- In-app (campana + badge)
- Email (reportes críticos, resumen diario opcional)
- WhatsApp Business API (alertas críticas)
- SMS (sin conexión a internet)

#### 15.3 Configuración
- Umbrales configurables por lote, línea genética y edad
- Horario silencioso (no molestar)
- Destinatarios por tipo de alerta

### 16. Análisis Económico y Rentabilidad

#### 16.1 KPIs Financieros
- **Costo por huevo**: (gasto total del período) / huevos producidos
- **Costo por docena**: estándar de la industria
- **Margen bruto**: ingreso venta huevos - costo alimento
- **Punto de equilibrio**: semana donde ingreso acumulado = costo total del lote
- **ROI del lote**: (ingreso total - costo total) / costo total × 100

#### 16.2 KPIs Técnicos
- **Huevos por ave alojada (HAA)**: total huevos / aves iniciales
- **Huevos por ave viva (HAV)**: total huevos / aves promedio
- **Conversión alimenticia**: kg alimento / kg huevo
- **Docenas por kg alimento**: docenas producidas / kg alimento
- **Viabilidad**: (1 - mortalidad acumulada / aves iniciales) × 100
- **Tasa de postura**: (huevos día / aves vivas) × 100

#### Tablas
```sql
CREATE TABLE costos_lote (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL REFERENCES lotes(id),
  tipo_costo VARCHAR(50) NOT NULL, -- 'pollita', 'alimento', 'vacuna', 'mano_obra',
                                    -- 'electricidad', 'agua', 'transporte', 'mantenimiento', 'otros'
  monto DECIMAL(12,2) NOT NULL,
  fecha DATE NOT NULL,
  categoria VARCHAR(50), -- 'fijo', 'variable'
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE resumen_lote (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID NOT NULL UNIQUE REFERENCES lotes(id),
  costo_total_alimento DECIMAL(12,2),
  costo_total_pollitas DECIMAL(12,2),
  costo_total_operativo DECIMAL(12,2),
  costo_total_general DECIMAL(12,2) GENERATED ALWAYS AS (
    COALESCE(costo_total_alimento,0) + COALESCE(costo_total_pollitas,0) + COALESCE(costo_total_operativo,0)
  ) STORED,
  ingreso_total_huevos DECIMAL(12,2),
  ingreso_total_gallinaza DECIMAL(12,2),
  ingreso_venta_descarte DECIMAL(12,2),
  margen_bruto DECIMAL(12,2) GENERATED ALWAYS AS (
    COALESCE(ingreso_total_huevos,0) - COALESCE(costo_total_alimento,0)
  ) STORED,
  roi_porcentaje DECIMAL(8,2) GENERATED ALWAYS AS (
    CASE WHEN costo_total_general > 0
      THEN ((COALESCE(ingreso_total_huevos,0) + COALESCE(ingreso_total_gallinaza,0) + COALESCE(ingreso_venta_descarte,0) - costo_total_general) / costo_total_general) * 100
      ELSE NULL END
  ) STORED,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Especificación de Gráficos

### CHART-001: Curva de Postura Teórica vs Real
**Tipo:** LineChart con ReferenceArea (Recharts)

```typescript
interface CurvaPosturaData {
  semana: number;
  postura_real: number;
  postura_teorica: number;
  limite_inferior: number;
  limite_superior: number;
}
```
- Área sombreada entre límites aceptables (±3% de la curva teórica)
- Puntos destacados en valores fuera de rango (alertas visuales)
- Tooltip con desviación porcentual
- Líneas de referencia verticales en eventos importantes (vacunación, cambios de alimento)
- **Endpoint:** `GET /api/metricas/curva-postura?lote_id={id}`

### CHART-002: Mortalidad Acumulada y Semanal
**Tipo:** ComposedChart (barras + línea)

```typescript
interface MortalidadData {
  semana: number;
  bajas_semanales: number;
  mortalidad_acumulada: number;
  porcentaje_mortalidad: number;
  viabilidad: number;
}
```
- Barras rojas para mortalidad semanal
- Línea azul de mortalidad acumulada
- Medidor de viabilidad (gauge chart circular)
- Comparativa con mortalidad esperada según línea genética

### CHART-003: Eficiencia Alimenticia y Conversión
**Tipo:** ComposedChart (doble eje Y)

```typescript
interface EficienciaAlimenticiaData {
  fecha: string;
  consumo_ave_dia_gramos: number;
  consumo_total_kg: number;
  conversion_kg_alimento_kg_huevo: number;
  docena_huevos_kg_alimento: number;
  costo_alimento_huevo: number;
}
```
- Línea de consumo promedio por ave
- Barras apiladas de huevos producidos (eje secundario)
- Banda óptima 2.0-2.2 kg alimento/kg huevo

### CHART-004: Dashboard de Producción Diaria
**Tipo:** Panel con widgets (múltiples)

```typescript
interface DashboardDiario {
  fecha_actual: string;
  postura_hoy: number;
  postura_ayer: number;
  tendencia_7dias: number[];
  mortalidad_acumulada: number;
  aves_vivas: number;
  clasificacion_hoy: Record<string, number>;
  alertas_activas: Array<{ tipo: string; mensaje: string }>;
}
```
- Velocímetro de postura (verde 90-95%, amarillo 85-89%, rojo <85%)
- Donut chart de clasificación por calibre
- Termómetro de mortalidad acumulada del mes
- Sparkline de tendencia semanal con flecha (↑↓→)

### CHART-005: Peso Promedio del Huevo y Uniformidad
**Tipo:** BoxPlot + LineChart

```typescript
interface PesoHuevoData {
  semana: number;
  peso_promedio_gramos: number;
  uniformidad: number;
  cv: number;
  huevos_fuera_rango: number;
}
```
- Box plot semanal para distribución de pesos
- Línea objetivo según categoría Extra (61-68g)
- Alerta cuando uniformidad <80%

### CHART-006: Proyección de Producción y Flujo de Caja
**Tipo:** AreaChart con capas

```typescript
interface ProyeccionData {
  semana: number;
  produccion_estimada: number;
  produccion_real: number;
  ingresos_proyectados: number;
  costos_proyectados: number;
  margen_estimado: number;
}
```
- Área verde: datos reales hasta semana actual
- Área azul claro: proyección estadística
- Línea de break-even
- Bandas de confianza (80% y 95%)

### CHART-007: Consumo de Agua (NUEVO)
**Tipo:** LineChart + BarChart

```typescript
interface ConsumoAguaData {
  fecha: string;
  litros_ave_dia: number;
  consumo_esperado: number;
  temperatura_promedio: number;
  alerta: boolean;
}
```
- Línea de consumo real vs esperado
- Barras de temperatura promedio (eje secundario)
- Marcador rojo en días con alerta

### CHART-008: Condiciones Ambientales (NUEVO)
**Tipo:** Multi-line chart

```typescript
interface AmbientalData {
  fecha_hora: string;
  temperatura: number;
  humedad: number;
  amoniaco: number;
  alerta_activa: boolean;
}
```
- Líneas de temperatura, humedad y amoníaco
- Thresholds visuales (líneas punteadas rojas en límites críticos)
- Timeline con eventos del galpón

### CHART-009: Indicador de Personal y Productividad (NUEVO)
**Tipo:** BarChart + Gauge

```typescript
interface ProductividadPersonalData {
  empleado: string;
  tareas_completadas: number;
  tareas_asignadas: number;
  eficiencia: number;
  horas_trabajadas: number;
  galpon: string;
}
```
- Barras de eficiencia por empleado
- Promedio del galpón como referencia

---

## Modelo de Datos Completo

### Tablas de Configuración y Maestros

```sql
CREATE TABLE curvas_estandar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  linea_genetica VARCHAR(100) NOT NULL,
  semana_vida INTEGER NOT NULL,
  postura_esperada DECIMAL(5,2),
  mortalidad_esperada DECIMAL(5,2),
  consumo_esperado_gramos DECIMAL(6,2),
  peso_huevo_esperado DECIMAL(5,2),
  peso_corporal_esperado DECIMAL(6,2),
  UNIQUE(linea_genetica, semana_vida)
);

CREATE TABLE configuracion_alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lote_id UUID REFERENCES lotes(id) NULL,
  tipo_alerta VARCHAR(50) NOT NULL,
  umbral_min DECIMAL(10,2),
  umbral_max DECIMAL(10,2),
  activa BOOLEAN DEFAULT true,
  canal_notificacion TEXT[] DEFAULT '{in_app}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(200) UNIQUE NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  rol VARCHAR(50) NOT NULL DEFAULT 'galponero',
  pin VARCHAR(6), -- PIN para galponeros (login simplificado)
  activo BOOLEAN DEFAULT true,
  ultimo_acceso TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Resumen de Tablas del Sistema

| # | Tabla | Módulo | Propósito |
|---|-------|--------|-----------|
| 1 | `usuarios` | Configuración | Usuarios del sistema |
| 2 | `galpones` | Configuración | Galpones |
| 3 | `secciones` | Configuración | Secciones dentro de cada galpón |
| 4 | `curvas_estandar` | Configuración | Curvas de rendimiento por línea genética |
| 5 | `configuracion_alertas` | Configuración | Umbrales de alerta personalizables |
| 6 | `lotes` | Ciclo de Vida | Lotes de gallinas |
| 7 | `eventos_lote` | Ciclo de Vida | Eventos importantes del lote |
| 8 | `registro_diario` | Producción | Registro diario por sección |
| 9 | `muestreo_peso` | Producción | Peso corporal y uniformidad |
| 10 | `consumo_agua` | Agua | Consumo diario de agua |
| 11 | `programa_iluminacion` | Iluminación | Programa de luz por semana |
| 12 | `registro_iluminacion_diario` | Iluminación | Registro real de iluminación |
| 13 | `registros_ambientales` | Ambiental | Temperatura, humedad, amoníaco |
| 14 | `formulas_alimento` | Alimentación | Fórmulas y composición nutricional |
| 15 | `consumo_alimento_diario` | Alimentación | Consumo diario de alimento |
| 16 | `recepcion_insumos` | Alimentación | Recepción de materia prima para alimento |
| 17 | `stock_insumos` | Alimentación | Stock de insumos para fabricación |
| 18 | `fabricacion_alimento` | Alimentación | Fabricación diaria de alimento |
| 19 | `detalle_fabricacion` | Alimentación | Detalle de insumos usados por fabricación |
| 20 | `registro_vacunacion` | Sanidad | Vacunaciones aplicadas |
| 21 | `registro_tratamientos` | Sanidad | Tratamientos y periodo de retiro |
| 22 | `necropsias` | Sanidad | Hallazgos de necropsia |
| 23 | `registro_visitas` | Bioseguridad | Control de acceso de visitas |
| 24 | `checklist_bioseguridad` | Bioseguridad | Checklist diario por galpón |
| 25 | `control_calidad_huevo` | Calidad | Parámetros de calidad de huevo |
| 26 | `trazabilidad` | Calidad | Trazabilidad farm-to-table |
| 27 | `registro_packing` | Packing | Registro diario de packing y clasificación |
| 28 | `formato_cajas` | Packing | Configuración de unidades por caja por categoría |
| 29 | `inventario_packing` | Packing | Stock acumulado de packing en cajas y unidades |
| 30 | `despachos` | Despacho | Registro de salidas y guías de despacho |
| 31 | `detalle_despacho` | Despacho | Detalle de cajas por categoría en cada despacho |
| 32 | `almacenes` | Inventario | Almacenes |
| 33 | `inventario_productos` | Inventario | Productos en inventario |
| 34 | `movimientos_inventario` | Inventario | Movimientos con auditoría |
| 35 | `inventario_huevos` | Inventario | Stock de huevos clasificados |
| 36 | `equipos` | Mantenimiento | Equipos registrados |
| 37 | `mantenimiento` | Mantenimiento | Historial de mantenimiento |
| 38 | `costos_lote` | Finanzas | Costos detallados por lote |
| 39 | `resumen_lote` | Finanzas | Resumen financiero por lote |
| 40 | `presupuestos` | Finanzas | Presupuestos y simulación |
| 41 | `residuos` | Gestión | Residuos y subproductos |

---

## Endpoints API

### Métricas y Dashboards

```
GET /api/metricas/dashboard/{lote_id}
GET /api/metricas/curva-postura?lote_id={id}
GET /api/metricas/mortalidad?lote_id={id}
GET /api/metricas/eficiencia-alimenticia?lote_id={id}
GET /api/metricas/peso-huevo?lote_id={id}
GET /api/metricas/proyeccion?lote_id={id}
GET /api/metricas/consumo-agua?lote_id={id}
GET /api/metricas/ambientales?lote_id={id}&galpon_id={id}
GET /api/metricas/comparativa-lotes?fecha_inicio={fecha}&fecha_fin={fecha}
GET /api/metricas/comparativa-lineas-geneticas
```

### Producción

```
POST   /api/produccion/registro-diario
GET    /api/produccion/registro-diario?lote_id={id}&fecha={fecha}
PUT    /api/produccion/registro-diario/{id}
GET    /api/produccion/registro-diario/historial?lote_id={id}&desde={fecha}&hasta={fecha}
POST   /api/produccion/muestreo-peso
GET    /api/produccion/muestreo-peso?lote_id={id}
```

### Lotes

```
GET    /api/lotes
POST   /api/lotes
GET    /api/lotes/{id}
PUT    /api/lotes/{id}
PATCH  /api/lotes/{id}/estado       # cambiar estado (cria→recria→postura→descarte→cerrado)
POST   /api/lotes/{id}/eventos
GET    /api/lotes/{id}/eventos
```

### Sanidad

```
GET    /api/sanidad/vacunacion?lote_id={id}
POST   /api/sanidad/vacunacion
GET    /api/sanidad/tratamientos?lote_id={id}
POST   /api/sanidad/tratamientos
GET    /api/sanidad/tratamientos/retiro-activo   # lotes en periodo de retiro
POST   /api/sanidad/necropsias
GET    /api/sanidad/necropsias?lote_id={id}
```

### Bioseguridad

```
POST   /api/bioseguridad/visitas
GET    /api/bioseguridad/visitas?desde={fecha}&hasta={fecha}
POST   /api/bioseguridad/checklist
GET    /api/bioseguridad/checklist?galpon_id={id}&fecha={fecha}
GET    /api/bioseguridad/resumen-mensual?mes={mes}&anio={anio}
```

### Ambiente

```
POST   /api/ambiente/registro
GET    /api/ambiente/registro?lote_id={id}&desde={fecha}&hasta={fecha}
GET    /api/ambiente/alertas-activas?galpon_id={id}
```

### Agua

```
POST   /api/agua/consumo
GET    /api/agua/consumo?lote_id={id}&desde={fecha}&hasta={fecha}
GET    /api/agua/alertas?lote_id={id}
```

### Iluminación

```
POST   /api/iluminacion/programa
GET    /api/iluminacion/programa?lote_id={id}
POST   /api/iluminacion/registro-diario
GET    /api/iluminacion/registro-diario?lote_id={id}&desde={fecha}&hasta={fecha}
```

### Packing

```
POST   /api/packing/registro
GET    /api/packing/registro?lote_id={id}&fecha={fecha}
GET    /api/packing/registro?desde={fecha}&hasta={fecha}
GET    /api/packing/resumen-diario?fecha={fecha}
GET    /api/packing/inventario
GET    /api/packing/formato-cajas
PUT    /api/packing/formato-cajas/{categoria}
```

### Despacho

```
POST   /api/despacho/registro
GET    /api/despacho/registro?desde={fecha}&hasta={fecha}
GET    /api/despacho/registro/{id}
GET    /api/despacho/balance-diario?fecha={fecha}
```

### Fábrica de Alimento

```
POST   /api/fabrica/recepcion-insumos
GET    /api/fabrica/recepcion-insumos?desde={fecha}&hasta={fecha}
GET    /api/fabrica/stock-insumos
POST   /api/fabrica/fabricacion
GET    /api/fabrica/fabricacion?desde={fecha}&hasta={fecha}
GET    /api/fabrica/fabricacion/{id}/detalle
GET    /api/fabrica/alertas-stock-bajo
```

### Inventarios

```
GET    /api/inventario/almacenes
POST   /api/inventario/almacenes
GET    /api/inventario/productos?almacen_id={id}
GET    /api/inventario/productos/{id}
POST   /api/inventario/movimientos
GET    /api/inventario/movimientos?producto_id={id}&desde={fecha}&hasta={fecha}
GET    /api/inventario/stock-bajo                    # alerta de reposición
GET    /api/inventario/huevos?almacen_id={id}&clasificacion={cat}
```

### Mantenimiento

```
GET    /api/mantenimiento/equipos?galpon_id={id}
POST   /api/mantenimiento/equipos
POST   /api/mantenimiento/registro
GET    /api/mantenimiento/registro?equipo_id={id}
GET    /api/mantenimiento/proximos
```

### Finanzas

```
POST   /api/finanzas/costos
GET    /api/finanzas/costos?lote_id={id}
POST   /api/finanzas/presupuestos
GET    /api/finanzas/presupuestos?anio={anio}&lote_id={id}
GET    /api/finanzas/resumen-lote/{id}
GET    /api/finanzas/costo-por-huevo?lote_id={id}&desde={fecha}&hasta={fecha}
GET    /api/finanzas/estado-resultados?desde={fecha}&hasta={fecha}
GET    /api/finanzas/flujo-caja?desde={fecha}&hasta={fecha}
```

### Reportes y Exportación

```
GET    /api/reportes/produccion-diaria?lote_id={id}&fecha={fecha}
GET    /api/reportes/produccion-diaria/{id}/pdf
GET    /api/reportes/semanal?lote_id={id}&semana={num}
GET    /api/reportes/mensual?lote_id={id}&mes={mes}&anio={anio}
GET    /api/reportes/economico-lote/{id}
GET    /api/reportes/economico-lote/{id}/pdf
GET    /api/reportes/exportar?tipo={tipo}&formato={xlsx|csv}&desde={fecha}&hasta={fecha}
```

### Alertas

```
GET    /api/alertas/activas?lote_id={id}
GET    /api/alertas/historial?desde={fecha}&hasta={fecha}
POST   /api/alertas/configurar
GET    /api/alertas/configuracion?lote_id={id}
PUT    /api/alertas/configuracion/{id}
```

---

## Reglas de Negocio Transversales

### RB-001: Bloqueo de Venta por Periodo de Retiro
Si un lote tiene un tratamiento activo en período de retiro, el sistema NO permite crear pedidos con huevos de ese lote hasta que `fecha_fin_retiro` haya pasado.

### RB-002: Stock Mínimo
Si el stock de un producto cae bajo `stock_minimo`, se genera una alerta al bodeguero y admin.

### RB-003: Validación de Consistencia
El registro diario no puede tener más bajas que aves vivas reportadas el día anterior. La suma de huevos clasificados debe coincidir con `huevos_producidos`.

### RB-004: Cuarentena de Visitas
Si un visitante registra haber estado en otra granja en los últimos 2 días, el sistema genera una alerta y requiere autorización del supervisor para ingresar.

### RB-005: Sincronización Offline
Los registros offline se sincronizan con resolución "última escritura gana". El usuario ve un indicador visual de estado de sincronización (✔ sincronizado, ⏳ pendiente, ✕ error).

### RB-006: Tasa de Postura Congelada
Si no se registra producción por 2 días consecutivos en un lote activo, el sistema asume la última tasa reportada y genera una alerta de "registro pendiente".

### RB-007: Costo Automático de Alimento
Cada registro de consumo diario de alimento genera automáticamente un movimiento de inventario (salida) y un registro en `costos_lote` con el costo calculado según el precio promedio del producto.

### RB-008: Cierre de Lote
Al cerrar un lote (estado `cerrado`), se calcula automáticamente `resumen_lote` con todos los costos e ingresos acumulados, y se inhabilita la creación de nuevos registros diarios para ese lote.

---

## Plan de Implementación (Roadmap)

### Fase 1: Fundación (Semanas 1-2)
- [ ] Inicializar Next.js + TypeScript + App Router
- [ ] Configurar Neon + Drizzle ORM
- [ ] Esquema de base de datos completo con migraciones
- [ ] Autenticación con NextAuth.js + roles
- [ ] Login con PIN para galponeros
- [ ] Layout base y navegación responsive

### Fase 2: Núcleo Productivo (Semanas 3-5)
- [ ] Gestión de galpones y lotes
- [ ] Registro diario de producción (mobile-first)
- [ ] Módulo de mortalidad y viabilidad
- [ ] Consumo de alimento diario
- [ ] Monitoreo de consumo de agua
- [ ] Funcionamiento offline + sincronización

### Fase 3: Calidad y Sanidad (Semanas 6-7)
- [ ] Vacunación y tratamientos
- [ ] Periodo de retiro con bloqueo de ventas
- [ ] Necropsias y diagnóstico
- [ ] Control de calidad de huevo
- [ ] Trazabilidad farm-to-table
- [ ] Checklist de bioseguridad
- [ ] Control de visitas y accesos

### Fase 4: Packing y Fábrica de Alimento (Semanas 8-10)
- [ ] Registro diario de packing con clasificación
- [ ] Descuento automático de inventario de huevos
- [ ] Recepción de insumos con trazabilidad (N° Lote, N° Guía)
- [ ] Stock de insumos y alertas de mínimo
- [ ] Fabricación de alimento con auto-deducción de insumos
- [ ] Multi-almacén con movimientos y auditoría

### Fase 5: Gráficos y Dashboards (Semanas 10-11)
- [ ] CHART-001 a CHART-009 completos
- [ ] Dashboard ejecutivo con widgets arrastrables
- [ ] Filtros por lote, fecha, galpón
- [ ] Exportación de gráficos a PNG/PDF
- [ ] Informe ejecutivo compilado

### Fase 6: Ambiental y Equipos (Semanas 12-13)
- [ ] Registro ambiental (temperatura, humedad, amoníaco)
- [ ] Iluminación: programa y registro real
- [ ] Equipos y mantenimiento preventivo/correctivo
- [ ] Alertas ambientales

### Fase 7: Finanzas (Semanas 14-15)
- [ ] Costos por lote (integración automática)
- [ ] Presupuestos y simulación de escenarios
- [ ] Dashboard financiero y ROI
- [ ] Estado de resultados y flujo de caja

### Fase 8: Reportes y Alertas (Semanas 16)
- [ ] Todos los reportes PDF
- [ ] Exportación Excel/CSV
- [ ] Sistema de alertas inteligentes completo
- [ ] Notificaciones in-app, email, WhatsApp
- [ ] Envío programado de reportes

### Fase 9: Pulido y Producción (Semanas 17-18)
- [ ] PWA completo (service workers, IndexedDB)
- [ ] Cache con Redis (Upstash)
- [ ] Vistas materializadas para métricas pesadas
- [ ] RLS en PostgreSQL
- [ ] Rate limiting y CSP headers
- [ ] Tests E2E (Playwright / Cypress)
- [ ] Despliegue en Vercel

---

## Requerimientos No Funcionales

### Rendimiento
- Tiempo de carga inicial (First Contentful Paint) < 2s
- Las consultas de dashboard no deben superar 500ms (con caché Redis)
- Soporte para 10+ galpones y 50+ lotes simultáneos
- Vistas materializadas para cálculos históricos pesados
- React Suspense Boundaries para carga progresiva de gráficos

### Seguridad
- Row Level Security (RLS) en Neon PostgreSQL
- Rate limiting en endpoints API
- Sanitización de inputs con Zod
- CSP headers configurados
- Autenticación 2FA para roles admin
- Auditoría de cambios en datos sensibles (costos, precios, inventario)

### Disponibilidad y Resiliencia
- PWA funcional offline: registro diario, consulta de datos cacheados
- Cola de sincronización con resolución de conflictos (last-write-wins)
- Backup automático diario (Neon)
- Tolerancia a fallos de red sin pérdida de datos

### Escalabilidad
- Arquitectura serverless (Vercel + Neon)
- Caché con Upstash Redis para dashboards frecuentes
- Incremental Static Regeneration para reportes públicos
- Optimistic Updates en formularios de registro diario

### UX/UI
- Mobile-first (galponero usa el sistema desde el galpón)
- Teclado numérico por defecto en formularios de registro
- Diseño offline-first con indicador de sincronización
- Notificaciones push en PWA
- Botones +/- grandes para ajuste táctil rápido
- Captura de voz para notas (Web Speech API)

---

## Apéndice: Integraciones Futuras

| Integración | Propósito | Prioridad |
|-------------|-----------|-----------|
| Clasificadora de huevos (Moba/Sanovo/Prinzen) | Recepción automática de pesos y clasificación | Alta |
| Sensores IoT (temperatura, humedad, NH₃) | Automatización de registro ambiental | Alta |
| Básculas digitales | Peso de alimento y huevos sin digitación | Alta |
| WhatsApp Business API | Notificaciones de alertas internas | Media |
| Bancos (API) | Conciliación de pagos | Baja |
| Generadores de respaldo | Monitoreo de corte eléctrico | Baja |
| Sistemas de nebulización | Control climático automático | Baja |
