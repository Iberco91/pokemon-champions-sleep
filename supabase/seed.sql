-- Semilla inicial de sleep_pokemon_species — Pokémon Champions & Sleep Toolkit
-- Datos verificados manualmente contra Game8 (https://game8.co/games/Pokemon-Sleep/)
-- el 2026-08-02: se cruzó cada especie contra su página de detalle individual
-- Y la página de listado de su especialidad (Berries/Ingredients/Skills), porque
-- el resumen automático de páginas individuales demostró equivocarse en algunos
-- casos (ver nota sobre Gastly más abajo).
--
-- Nota: Snorlax NO está en esta lista a propósito — no es un Pokémon ayudante
-- registrable en el juego real, es el personaje al que se alimenta.
--
-- Este es un lote curado (11 especies) para tener el registro y scoring
-- funcionando. La carga del Pokédex completo, sincronizada con las
-- actualizaciones semanales/mensuales de Game8, queda para la Fase 9 (junto
-- con el Meta Tracker de Champions).

insert into sleep_pokemon_species (name, specialty, berry_type, main_skill, base_carry_limit, base_frequency_seconds)
values
  -- Berries
  ('Pikachu', 'Berries', 'Grepa Berry', 'Charge Strength S', 17, 2700),   -- 45 min
  ('Raichu', 'Berries', 'Grepa Berry', 'Charge Strength S', 21, 2200),    -- 36 min 40 s
  ('Rattata', 'Berries', 'Persim Berry', 'Charge Energy S', 10, 4900),    -- 1 h 21 min 40 s

  -- Ingredients (incluye la línea evolutiva completa Gastly -> Haunter -> Gengar
  -- para probar el comparador de la Fase 5; su especialidad real es Ingredients,
  -- no Skills como decía el ejemplo ilustrativo del CLAUDE.md)
  ('Gastly', 'Ingredients', 'Bluk Berry', 'Charge Strength S', 10, 3800),    -- 1 h 3 min 20 s
  ('Haunter', 'Ingredients', 'Bluk Berry', 'Charge Strength S', 14, 3000),   -- 50 min
  ('Gengar', 'Ingredients', 'Bluk Berry', 'Charge Strength S', 18, 2200),    -- 36 min 40 s
  ('Bulbasaur', 'Ingredients', 'Durin Berry', 'Ingredient Magnet S', 11, 4400), -- 1 h 13 min 20 s
  ('Charmander', 'Ingredients', 'Leppa Berry', 'Ingredient Magnet S', 12, 3500), -- 58 min 20 s

  -- Skills (Wigglytuff y Sylveon son los soportes con Energy for Everyone
  -- para la restricción obligatoria del optimizer de la Fase 6)
  ('Wigglytuff', 'Skills', 'Pecha Berry', 'Energy for Everyone S', 13, 2900), -- 48 min 20 s
  ('Sylveon', 'Skills', 'Pecha Berry', 'Energy for Everyone S', 15, 2600),    -- 43 min 20 s
  ('Eevee', 'Skills', 'Persim Berry', 'Ingredient Magnet S', 12, 3700)        -- 1 h 1 min 40 s
on conflict (name) do nothing;
