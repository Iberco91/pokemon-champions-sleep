# Proyecto: Pokémon Champions & Sleep Toolkit

### ## 📌 1. Visión General del Proyecto

- Plataforma web integral de herramientas de optimización y analítica para dos títulos de la franquicia Pokémon:
    1. **Pokémon Sleep:** Gestión de boxes, evaluación de sub-skills/naturalezas por especialismo, simulador de equipos óptimos para mapas/recetas y comparación evolutiva.
    2. **Pokémon Champions:** Gestión de motes/builds, tracking automático del Meta quincenal y simulador de win-rate frente al Top 25.

### ## 🛠️ 2. Stack Tecnológico & Arquitectura

- **Frontend:** React 18+ (Vite), JavaScript (ES6+), CSS Modules / Tailwind CSS (estética temática Pokémon).
- **Backend & Database:** Supabase (PostgreSQL para almacenamiento relacional de Pokémon del usuario y cachés de Meta).
- **Hosting / Despliegue:** Vercel (con soporte de Environment Variables para llaves de Supabase).
- **Integración Web Crawling / Search:** Módulo de búsqueda para rastreo bi-semanal del Meta competitivo de Pokémon Champions.

### ## 🎨 3. Guía de Estilo e Interfaz (UI/UX)

- **Estética:** Colores y estilos tradicionales de la franquicia Pokémon (Rojo Pokeball `#FF0000`, Amarillo Pikachu `#FFDE00`, Azul Pokémon `#3B4CCA`, acentos en tonos crema de Pokédex clásica).
- **Navegación:** Menú principal con switches claros entre las dos aplicaciones madres: Pokémon Sleep y Pokémon Champions, desplegando un dashboard con sus respectivas sub-secciones.

### ## 📋 4. Módulos & Especificaciones Funcionales

#### 🟢 MÓDULO 1: POKÉMON SLEEP

**1.1 Registro & Base de Datos Autocompletada de Pokémon**

- **Carga Inteligente:** Al seleccionar una especie (ej. Gastly), el sistema autocompleta los atributos fijos de especie:
    - Especialidad: Berries, Ingredientes o Skills.
    - Berry asignada: (Ej. Berry Arándano para tipo Fantasma).
    - Main Skill base: (Ej. Charge Energy S).
- **Atributos Dinámicos (Ingreso de Usuario):**
    - Ingredientes (Slots A, B, C): Selección de las 3 opciones.
    - Carry Limit Base: Cálculo dinámico ajustado por sub-skills / evoluciones.
    - Frecuencia: Cálculo dinámico basado en Especie + Nivel + Sub-skills de velocidad + Naturaleza.
    - 5 Sub-skills (Niveles 10, 25, 50, 70, 80 — actualizado desde el parche 3.6.0, antes eran 75 y 100): Selección entre la lista oficial (Berry Finding S, Ingredient Finder M, Helping Speed L, etc.).
    - Naturaleza: Afecta stats (Frecuencia, Ingredient Finding, Main Skill Chance, EXP, Energy Recovery).
    - Nivel y RP: Opción de ajustar el nivel manualmente y cálculo automático estimado de RP. Opción de sobreescritura manual del RP.

**1.2 Sistema de Evaluación Automática de Calidad (Scoring System)**

El sistema evalúa el Pokémon recién ingresado asignando una puntuación (% de Compatibilidad / Tier S-A-B-C) según su especialidad:

| Especialidad | Criterios Filtro / Obligatorios | Sub-skills Deseadas | Naturaleza Óptima |
|---|---|---|---|
| Berries | Berry Finding S (BFS) es 100% OBLIGATORIO. (Si no tiene BFS, Score = 0% para entrenamiento). | Helping Bonus, Helping Speed S/M/L. | + Helping Speed (o neutra positiva). |
| Ingredientes | Combinación de Ingredientes: Ideal AAA (100%), ABA (Aceptable/70%), ABC (Subóptimo). | Ingredient Finder S/M, Inventory Up S/M/L, Helping Bonus. | + Ingredient Finding. |
| Skills | Sin filtro estricto, pero prioriza activación. | Skill Trigger S/M/L, Helping Speed S/M/L, Helping Bonus. | + Main Skill Chance. |

**1.3 Comparador Evolutivo / Sustitución de Box**

- Al registrar un nuevo Pokémon con potencial de entrenamiento, el sistema consulta el Box buscando ejemplares de la misma especie o línea evolutiva (ej. Gastly vs. Gengar actual).
- Muestra un panel comparativo de Head-to-Head indicando cuál tiene mejor proyección de rendimiento a nivel objetivo (ej. Nivel 30 / Nivel 50).

**1.4 Optimizer de Equipo Ideal (Snorlax & Mapas)**

> ⭐ **OBJETIVO PRINCIPAL DE ESTA HERRAMIENTA:** dado un Mapa, las Berries favoritas de Snorlax de la semana y el plato favorito de la semana, el algoritmo debe **MAXIMIZAR LA CANTIDAD DE CALORÍAS SEMANALES QUE PUEDE OBTENER SNORLAX**, eligiendo el equipo de 5 entre los Pokémon que el usuario YA tiene guardados en su Box (los que decidió entrenar/conservar). Esta es la función central del Módulo 1 — no un cálculo de "puntos" abstractos. Es una herramienta distinta y posterior a la de la sección 1.2 (que evalúa si vale la pena entrenar/guardar un Pokémon nuevo); el optimizer nunca considera Pokémon fuera de la Box.

- **Inputs de Usuario:** Mapa seleccionado, Berries favoritas de Snorlax (3), Tipo de plato de la semana (Curry, Ensaladas, Postres).
- **Restricción Obligatoria:** El equipo óptimo de 5 Pokémon debe incluir sí o sí 1 Pokémon Support con la Main Skill Energy for Everyone (ej. Wigglytuff, Sylveon, Pawmot).
- **Algoritmo de Maximización:** Selecciona los 4 integrantes restantes del Box del usuario (solo Pokémon ya guardados/entrenados, nunca candidatos nuevos) para maximizar las calorías semanales totales que recibe Snorlax, combinando:
    - Calorías por Berries entregadas (favoritas = doble de fuerza/calorías, según la mecánica real del juego).
    - Calorías por platos cocinados con los Ingredientes recolectados, priorizando el/los platos de mayor valor calórico del tipo de la semana.

#### 🔴 MÓDULO 2: POKÉMON CHAMPIONS

**2.1 Registro de Pokémon Entrenados (Competitive Box)**

- Formulario para guardar Pokémon listos para combate: Especie, Formato, Mote, EVs/IVs, Naturaleza, Habilidad, Objeto equipado, Teratipo / Mecánica de turno y Moveset (4 Ataques).

**2.2 Meta Tracker (Rastreo Bi-semanal Automatizado)**

- Módulo de consulta automática/manual que obtiene y parsea los Top 25 Pokémon del Meta competitivo actual (cada 14 días).
- Guarda en Supabase las fichas del Meta: Porcentaje de uso, Movesets más comunes, Objetos dominantes, Repartición de EVs estándar y Naturalezas.

**2.3 Simulador de Win-Rate & Matrix Counter**

- **Análisis de Equipo vs. Meta:** El usuario selecciona su equipo de 6.
- **Cálculo de Cobertura y Win-Rate Estimado:**
    - Evalúa debilidades de tipos cruzadas contra el Top 25.
    - Calcula la tasa de victoria teórica basada en Speed tiers, Matchups de tipos directos y respuestas de Check/Counter.
- **Sugerencias de Mejora:** Módulo que indica vulnerabilidades críticas (Ej. "Tu equipo cae en 80% frente a Flutter Mane/Ogerpon. Se sugiere cambiar el objeto X o incluir un tipo Acero con Tera Y").

### ## 🗄️ 5. Modelo de Datos Proyectado (Supabase / Postgres)

```sql
-- Tablas principales de Pokémon Sleep
CREATE TABLE sleep_pokemon_species (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    specialty VARCHAR(20) CHECK (specialty IN ('Berries', 'Ingredients', 'Skills')),
    berry_type VARCHAR(30) NOT NULL,
    main_skill VARCHAR(50) NOT NULL,
    base_carry_limit INT NOT NULL,
    base_frequency_seconds INT NOT NULL
);

CREATE TABLE user_sleep_box (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    species_id INT REFERENCES sleep_pokemon_species(id),
    nickname VARCHAR(50),
    level INT DEFAULT 1,
    current_rp INT,
    ingredient_a VARCHAR(50),
    ingredient_b VARCHAR(50),
    ingredient_c VARCHAR(50),
    subskill_10 VARCHAR(50),
    subskill_25 VARCHAR(50),
    subskill_50 VARCHAR(50),
    subskill_70 VARCHAR(50),
    subskill_80 VARCHAR(50),
    nature VARCHAR(30),
    evaluation_score NUMERIC(5,2),
    is_trained BOOLEAN DEFAULT FALSE
);

-- Tablas principales de Pokémon Champions
CREATE TABLE user_champions_box (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    species VARCHAR(50) NOT NULL,
    nickname VARCHAR(50),
    nature VARCHAR(30),
    ability VARCHAR(50),
    held_item VARCHAR(50),
    tera_type VARCHAR(30),
    move_1 VARCHAR(50),
    move_2 VARCHAR(50),
    move_3 VARCHAR(50),
    move_4 VARCHAR(50),
    ev_spread JSONB,
    iv_spread JSONB
);

CREATE TABLE champions_meta_cache (
    id SERIAL PRIMARY KEY,
    updated_at TIMESTAMP DEFAULT NOW(),
    rank_position INT,
    pokemon_name VARCHAR(50),
    common_moves JSONB,
    common_items JSONB,
    usage_percentage NUMERIC(5,2)
);
```

### ## 6. Reglas de Desarrollo para Claude Code

- **Convención de Idioma:** Código, variables, comentarios de funciones y nombres de tablas en Inglés. Texto de la interfaz, labels de usuario e instrucciones en Español.
- **Modularización React:** Cada sub-sección debe vivir en su propia carpeta bajo `src/components/sleep/` y `src/components/champions/`.
- **Manejo de Errores & Fallbacks:** Las llamadas a la API de Supabase y a la búsqueda del Meta de Champions deben tener estados de loading, error y fallback visuales.
- **Respetar Reglas de Dominio de Pokémon Sleep:** El calculador de compatibilidad NUNCA debe marcar más de 0% de compatibilidad para un Pokémon de tipo Berries si no posee Berry Finding S en sus sub-skills.
- **Limpieza Inicial de Proyecto:** Al iniciar el proyecto, eliminar los archivos de plantilla innecesarios creados por Vite (como `src/App.css`, `src/assets/react.svg`, etc.) y limpiar el boilerplate de `App.jsx` para dejar una estructura de carpetas mínima, limpia y lista para desarrollo.
