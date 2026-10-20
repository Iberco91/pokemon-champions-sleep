// Pool real de ingrediente por especie y slot (A = nivel 1, B = nivel 30, C = nivel 60), generado
// desde el codigo fuente de nerolis-lab/nerolis-lab (pokemon.ts ingredient0/ingredient30/ingredient60
// -- son exactamente el mismo dato que las paginas "Helping Stats" de Game8: la lista acumulada de
// ingredientes que la especie puede producir en cada tramo de nivel), verificado 2026-09-02. Cubre
// las 238 especies del Pokedex actual (sin legendarios/miticos, ver nota en seed.sql)
// -- reemplaza el lote curado de 11 (que coincidia exactamente salvo Rattata, que aqui queda con
// el dato real en vez de la estimacion anterior).
export const speciesIngredientSlots = {
  'Butterfree': {
    a: [
      { name: 'Honey', quantity: 1 },
    ],
    b: [
      { name: 'Honey', quantity: 2 },
      { name: 'Snoozy Tomato', quantity: 2 },
    ],
    c: [
      { name: 'Honey', quantity: 4 },
      { name: 'Snoozy Tomato', quantity: 3 },
      { name: 'Greengrass Soybeans', quantity: 4 },
    ],
  },
  'Raticate': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Greengrass Soybeans', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Greengrass Soybeans', quantity: 3 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Arbok': {
    a: [
      { name: 'Bean Sausage', quantity: 1 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 2 },
      { name: 'Fancy Egg', quantity: 2 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Fancy Egg', quantity: 3 },
      { name: 'Fiery Herb', quantity: 3 },
    ],
  },
  'Pikachu (Halloween)': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Warming Ginger', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Warming Ginger', quantity: 3 },
      { name: 'Fancy Egg', quantity: 3 },
    ],
  },
  'Pikachu (Captain)': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Warming Ginger', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Warming Ginger', quantity: 3 },
      { name: 'Fancy Egg', quantity: 3 },
    ],
  },
  'Raichu': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Warming Ginger', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Warming Ginger', quantity: 3 },
      { name: 'Fancy Egg', quantity: 3 },
    ],
  },
  'Clefable': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Honey', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Honey', quantity: 3 },
      { name: 'Greengrass Soybeans', quantity: 3 },
    ],
  },
  'Ninetales': {
    a: [
      { name: 'Greengrass Soybeans', quantity: 1 },
    ],
    b: [
      { name: 'Greengrass Soybeans', quantity: 2 },
      { name: 'Greengrass Corn', quantity: 2 },
    ],
    c: [
      { name: 'Greengrass Soybeans', quantity: 4 },
      { name: 'Greengrass Corn', quantity: 3 },
      { name: 'Soft Potato', quantity: 3 },
    ],
  },
  'Ninetales (Alolan Form)': {
    a: [
      { name: 'Greengrass Soybeans', quantity: 1 },
    ],
    b: [
      { name: 'Greengrass Soybeans', quantity: 2 },
      { name: 'Greengrass Corn', quantity: 2 },
    ],
    c: [
      { name: 'Greengrass Soybeans', quantity: 4 },
      { name: 'Greengrass Corn', quantity: 3 },
      { name: 'Soft Potato', quantity: 3 },
    ],
  },
  'Primeape': {
    a: [
      { name: 'Bean Sausage', quantity: 1 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 2 },
      { name: 'Tasty Mushroom', quantity: 1 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Tasty Mushroom', quantity: 2 },
      { name: 'Honey', quantity: 4 },
    ],
  },
  'Dodrio': {
    a: [
      { name: 'Greengrass Soybeans', quantity: 1 },
    ],
    b: [
      { name: 'Greengrass Soybeans', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    c: [
      { name: 'Greengrass Soybeans', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Onix': {
    a: [
      { name: 'Snoozy Tomato', quantity: 1 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 2 },
      { name: 'Bean Sausage', quantity: 2 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 4 },
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Soft Potato', quantity: 3 },
    ],
  },
  'Marowak': {
    a: [
      { name: 'Warming Ginger', quantity: 1 },
    ],
    b: [
      { name: 'Warming Ginger', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 2 },
    ],
    c: [
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 3 },
    ],
  },
  'Meganium': {
    a: [
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    b: [
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Honey', quantity: 3 },
    ],
    c: [
      { name: 'Soothing Cacao', quantity: 4 },
      { name: 'Honey', quantity: 5 },
      { name: 'Large Leek', quantity: 3 },
    ],
  },
  'Typhlosion': {
    a: [
      { name: 'Warming Ginger', quantity: 1 },
    ],
    b: [
      { name: 'Warming Ginger', quantity: 2 },
      { name: 'Fiery Herb', quantity: 2 },
    ],
    c: [
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Fiery Herb', quantity: 3 },
      { name: 'Pure Oil', quantity: 3 },
    ],
  },
  'Feraligatr': {
    a: [
      { name: 'Bean Sausage', quantity: 1 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 2 },
      { name: 'Pure Oil', quantity: 2 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Pure Oil', quantity: 3 },
    ],
  },
  'Xatu': {
    a: [
      { name: 'Fancy Egg', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 3 },
      { name: 'Fancy Apple', quantity: 5 },
    ],
  },
  'Steelix': {
    a: [
      { name: 'Snoozy Tomato', quantity: 1 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 2 },
      { name: 'Bean Sausage', quantity: 2 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 4 },
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Soft Potato', quantity: 3 },
    ],
  },
  'Houndoom': {
    a: [
      { name: 'Fiery Herb', quantity: 1 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 2 },
      { name: 'Warming Ginger', quantity: 3 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Large Leek', quantity: 3 },
    ],
  },
  'Blaziken': {
    a: [
      { name: 'Tasty Mushroom', quantity: 1 },
    ],
    b: [
      { name: 'Tasty Mushroom', quantity: 2 },
      { name: 'Greengrass Soybeans', quantity: 4 },
    ],
    c: [
      { name: 'Tasty Mushroom', quantity: 4 },
      { name: 'Greengrass Soybeans', quantity: 6 },
      { name: 'Pure Oil', quantity: 5 },
    ],
  },
  'Swampert': {
    a: [
      { name: 'Greengrass Corn', quantity: 1 },
    ],
    b: [
      { name: 'Greengrass Corn', quantity: 2 },
      { name: 'Moomoo Milk', quantity: 3 },
    ],
    c: [
      { name: 'Greengrass Corn', quantity: 4 },
      { name: 'Moomoo Milk', quantity: 5 },
      { name: 'Tasty Mushroom', quantity: 3 },
    ],
  },
  'Vigoroth': {
    a: [
      { name: 'Snoozy Tomato', quantity: 1 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 2 },
      { name: 'Honey', quantity: 2 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 4 },
      { name: 'Honey', quantity: 4 },
      { name: 'Fancy Apple', quantity: 4 },
    ],
  },
  'Slaking': {
    a: [
      { name: 'Snoozy Tomato', quantity: 1 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 2 },
      { name: 'Honey', quantity: 2 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 4 },
      { name: 'Honey', quantity: 4 },
      { name: 'Fancy Apple', quantity: 4 },
    ],
  },
  'Altaria': {
    a: [
      { name: 'Fancy Egg', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 2 },
      { name: 'Greengrass Soybeans', quantity: 3 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 4 },
      { name: 'Greengrass Soybeans', quantity: 4 },
      { name: 'Fancy Apple', quantity: 5 },
    ],
  },
  'Banette': {
    a: [
      { name: 'Pure Oil', quantity: 1 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 2 },
      { name: 'Warming Ginger', quantity: 2 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Tasty Mushroom', quantity: 3 },
    ],
  },
  'Walrein': {
    a: [
      { name: 'Pure Oil', quantity: 1 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 4 },
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
    ],
  },
  'Salamence': {
    a: [
      { name: 'Soft Potato', quantity: 1 },
    ],
    b: [
      { name: 'Soft Potato', quantity: 2 },
      { name: 'Warming Ginger', quantity: 3 },
    ],
    c: [
      { name: 'Soft Potato', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Bean Sausage', quantity: 4 },
    ],
  },
  'Empoleon': {
    a: [
      { name: 'Fancy Egg', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 2 },
      { name: 'Large Leek', quantity: 1 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 4 },
      { name: 'Large Leek', quantity: 2 },
      { name: 'Honey', quantity: 4 },
    ],
  },
  'Weavile': {
    a: [
      { name: 'Bean Sausage', quantity: 1 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 2 },
      { name: 'Fancy Egg', quantity: 2 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Fancy Egg', quantity: 3 },
      { name: 'Greengrass Soybeans', quantity: 4 },
    ],
  },
  'Musharna': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Honey', quantity: 2 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Honey', quantity: 3 },
      { name: 'Rousing Coffee', quantity: 2 },
    ],
  },
  'Tyrantrum': {
    a: [
      { name: 'Bean Sausage', quantity: 1 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 2 },
      { name: 'Fancy Apple', quantity: 3 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Soft Potato', quantity: 3 },
    ],
  },
  'Tinkaton': {
    a: [
      { name: 'Snoozy Tomato', quantity: 1 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 2 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 3 },
      { name: 'Soft Potato', quantity: 3 },
    ],
  },
  'Caterpie': {
    a: [
      { name: 'Honey', quantity: 1 },
    ],
    b: [
      { name: 'Honey', quantity: 2 },
      { name: 'Snoozy Tomato', quantity: 2 },
    ],
    c: [
      { name: 'Honey', quantity: 4 },
      { name: 'Snoozy Tomato', quantity: 3 },
      { name: 'Greengrass Soybeans', quantity: 4 },
    ],
  },
  'Metapod': {
    a: [
      { name: 'Honey', quantity: 1 },
    ],
    b: [
      { name: 'Honey', quantity: 2 },
      { name: 'Snoozy Tomato', quantity: 2 },
    ],
    c: [
      { name: 'Honey', quantity: 4 },
      { name: 'Snoozy Tomato', quantity: 3 },
      { name: 'Greengrass Soybeans', quantity: 4 },
    ],
  },
  'Rattata': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Greengrass Soybeans', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Greengrass Soybeans', quantity: 3 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Ekans': {
    a: [
      { name: 'Bean Sausage', quantity: 1 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 2 },
      { name: 'Fancy Egg', quantity: 2 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Fancy Egg', quantity: 3 },
      { name: 'Fiery Herb', quantity: 3 },
    ],
  },
  'Pikachu': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Warming Ginger', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Warming Ginger', quantity: 3 },
      { name: 'Fancy Egg', quantity: 3 },
    ],
  },
  'Clefairy': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Honey', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Honey', quantity: 3 },
      { name: 'Greengrass Soybeans', quantity: 3 },
    ],
  },
  'Vulpix': {
    a: [
      { name: 'Greengrass Soybeans', quantity: 1 },
    ],
    b: [
      { name: 'Greengrass Soybeans', quantity: 2 },
      { name: 'Greengrass Corn', quantity: 2 },
    ],
    c: [
      { name: 'Greengrass Soybeans', quantity: 4 },
      { name: 'Greengrass Corn', quantity: 3 },
      { name: 'Soft Potato', quantity: 3 },
    ],
  },
  'Vulpix (Alolan Form)': {
    a: [
      { name: 'Greengrass Soybeans', quantity: 1 },
    ],
    b: [
      { name: 'Greengrass Soybeans', quantity: 2 },
      { name: 'Greengrass Corn', quantity: 2 },
    ],
    c: [
      { name: 'Greengrass Soybeans', quantity: 4 },
      { name: 'Greengrass Corn', quantity: 3 },
      { name: 'Soft Potato', quantity: 3 },
    ],
  },
  'Mankey': {
    a: [
      { name: 'Bean Sausage', quantity: 1 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 2 },
      { name: 'Tasty Mushroom', quantity: 1 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Tasty Mushroom', quantity: 2 },
      { name: 'Honey', quantity: 4 },
    ],
  },
  'Doduo': {
    a: [
      { name: 'Greengrass Soybeans', quantity: 1 },
    ],
    b: [
      { name: 'Greengrass Soybeans', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    c: [
      { name: 'Greengrass Soybeans', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Cubone': {
    a: [
      { name: 'Warming Ginger', quantity: 1 },
    ],
    b: [
      { name: 'Warming Ginger', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 2 },
    ],
    c: [
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 3 },
    ],
  },
  'Eevee (Holiday)': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Chikorita': {
    a: [
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    b: [
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Honey', quantity: 3 },
    ],
    c: [
      { name: 'Soothing Cacao', quantity: 4 },
      { name: 'Honey', quantity: 5 },
      { name: 'Large Leek', quantity: 3 },
    ],
  },
  'Bayleef': {
    a: [
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    b: [
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Honey', quantity: 3 },
    ],
    c: [
      { name: 'Soothing Cacao', quantity: 4 },
      { name: 'Honey', quantity: 5 },
      { name: 'Large Leek', quantity: 3 },
    ],
  },
  'Cyndaquil': {
    a: [
      { name: 'Warming Ginger', quantity: 1 },
    ],
    b: [
      { name: 'Warming Ginger', quantity: 2 },
      { name: 'Fiery Herb', quantity: 2 },
    ],
    c: [
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Fiery Herb', quantity: 3 },
      { name: 'Pure Oil', quantity: 3 },
    ],
  },
  'Quilava': {
    a: [
      { name: 'Warming Ginger', quantity: 1 },
    ],
    b: [
      { name: 'Warming Ginger', quantity: 2 },
      { name: 'Fiery Herb', quantity: 2 },
    ],
    c: [
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Fiery Herb', quantity: 3 },
      { name: 'Pure Oil', quantity: 3 },
    ],
  },
  'Totodile': {
    a: [
      { name: 'Bean Sausage', quantity: 1 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 2 },
      { name: 'Pure Oil', quantity: 2 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Pure Oil', quantity: 3 },
    ],
  },
  'Croconaw': {
    a: [
      { name: 'Bean Sausage', quantity: 1 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 2 },
      { name: 'Pure Oil', quantity: 2 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Pure Oil', quantity: 3 },
    ],
  },
  'Pichu': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Warming Ginger', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Warming Ginger', quantity: 3 },
      { name: 'Fancy Egg', quantity: 3 },
    ],
  },
  'Cleffa': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Honey', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Honey', quantity: 3 },
      { name: 'Greengrass Soybeans', quantity: 3 },
    ],
  },
  'Natu': {
    a: [
      { name: 'Fancy Egg', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 3 },
      { name: 'Fancy Apple', quantity: 5 },
    ],
  },
  'Sneasel': {
    a: [
      { name: 'Bean Sausage', quantity: 1 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 2 },
      { name: 'Fancy Egg', quantity: 2 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Fancy Egg', quantity: 3 },
      { name: 'Greengrass Soybeans', quantity: 4 },
    ],
  },
  'Houndour': {
    a: [
      { name: 'Fiery Herb', quantity: 1 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 2 },
      { name: 'Warming Ginger', quantity: 3 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Large Leek', quantity: 3 },
    ],
  },
  'Torchic': {
    a: [
      { name: 'Tasty Mushroom', quantity: 1 },
    ],
    b: [
      { name: 'Tasty Mushroom', quantity: 2 },
      { name: 'Greengrass Soybeans', quantity: 4 },
    ],
    c: [
      { name: 'Tasty Mushroom', quantity: 4 },
      { name: 'Greengrass Soybeans', quantity: 6 },
      { name: 'Pure Oil', quantity: 5 },
    ],
  },
  'Combusken': {
    a: [
      { name: 'Tasty Mushroom', quantity: 1 },
    ],
    b: [
      { name: 'Tasty Mushroom', quantity: 2 },
      { name: 'Greengrass Soybeans', quantity: 4 },
    ],
    c: [
      { name: 'Tasty Mushroom', quantity: 4 },
      { name: 'Greengrass Soybeans', quantity: 6 },
      { name: 'Pure Oil', quantity: 5 },
    ],
  },
  'Mudkip': {
    a: [
      { name: 'Greengrass Corn', quantity: 1 },
    ],
    b: [
      { name: 'Greengrass Corn', quantity: 2 },
      { name: 'Moomoo Milk', quantity: 3 },
    ],
    c: [
      { name: 'Greengrass Corn', quantity: 4 },
      { name: 'Moomoo Milk', quantity: 5 },
      { name: 'Tasty Mushroom', quantity: 3 },
    ],
  },
  'Marshtomp': {
    a: [
      { name: 'Greengrass Corn', quantity: 1 },
    ],
    b: [
      { name: 'Greengrass Corn', quantity: 2 },
      { name: 'Moomoo Milk', quantity: 3 },
    ],
    c: [
      { name: 'Greengrass Corn', quantity: 4 },
      { name: 'Moomoo Milk', quantity: 5 },
      { name: 'Tasty Mushroom', quantity: 3 },
    ],
  },
  'Slakoth': {
    a: [
      { name: 'Snoozy Tomato', quantity: 1 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 2 },
      { name: 'Honey', quantity: 2 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 4 },
      { name: 'Honey', quantity: 4 },
      { name: 'Fancy Apple', quantity: 4 },
    ],
  },
  'Swablu': {
    a: [
      { name: 'Fancy Egg', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 2 },
      { name: 'Greengrass Soybeans', quantity: 3 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 4 },
      { name: 'Greengrass Soybeans', quantity: 4 },
      { name: 'Fancy Apple', quantity: 5 },
    ],
  },
  'Shuppet': {
    a: [
      { name: 'Pure Oil', quantity: 1 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 2 },
      { name: 'Warming Ginger', quantity: 2 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Tasty Mushroom', quantity: 3 },
    ],
  },
  'Spheal': {
    a: [
      { name: 'Pure Oil', quantity: 1 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 4 },
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
    ],
  },
  'Sealeo': {
    a: [
      { name: 'Pure Oil', quantity: 1 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 4 },
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
    ],
  },
  'Bagon': {
    a: [
      { name: 'Soft Potato', quantity: 1 },
    ],
    b: [
      { name: 'Soft Potato', quantity: 2 },
      { name: 'Warming Ginger', quantity: 3 },
    ],
    c: [
      { name: 'Soft Potato', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Bean Sausage', quantity: 4 },
    ],
  },
  'Shelgon': {
    a: [
      { name: 'Soft Potato', quantity: 1 },
    ],
    b: [
      { name: 'Soft Potato', quantity: 2 },
      { name: 'Warming Ginger', quantity: 3 },
    ],
    c: [
      { name: 'Soft Potato', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Bean Sausage', quantity: 4 },
    ],
  },
  'Piplup': {
    a: [
      { name: 'Fancy Egg', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 2 },
      { name: 'Large Leek', quantity: 1 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 4 },
      { name: 'Large Leek', quantity: 2 },
      { name: 'Honey', quantity: 4 },
    ],
  },
  'Prinplup': {
    a: [
      { name: 'Fancy Egg', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 2 },
      { name: 'Large Leek', quantity: 1 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 4 },
      { name: 'Large Leek', quantity: 2 },
      { name: 'Honey', quantity: 4 },
    ],
  },
  'Munna': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Honey', quantity: 2 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Honey', quantity: 3 },
      { name: 'Rousing Coffee', quantity: 2 },
    ],
  },
  'Tyrunt': {
    a: [
      { name: 'Bean Sausage', quantity: 1 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 2 },
      { name: 'Fancy Apple', quantity: 3 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Soft Potato', quantity: 3 },
    ],
  },
  'Tinkatink': {
    a: [
      { name: 'Snoozy Tomato', quantity: 1 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 2 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 3 },
      { name: 'Soft Potato', quantity: 3 },
    ],
  },
  'Tinkatuff': {
    a: [
      { name: 'Snoozy Tomato', quantity: 1 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 2 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 3 },
      { name: 'Soft Potato', quantity: 3 },
    ],
  },
  'Venusaur': {
    a: [
      { name: 'Honey', quantity: 2 },
    ],
    b: [
      { name: 'Honey', quantity: 5 },
      { name: 'Snoozy Tomato', quantity: 4 },
    ],
    c: [
      { name: 'Honey', quantity: 7 },
      { name: 'Snoozy Tomato', quantity: 7 },
      { name: 'Soft Potato', quantity: 6 },
    ],
  },
  'Charizard': {
    a: [
      { name: 'Bean Sausage', quantity: 2 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 5 },
      { name: 'Warming Ginger', quantity: 4 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 7 },
      { name: 'Warming Ginger', quantity: 7 },
      { name: 'Fiery Herb', quantity: 6 },
    ],
  },
  'Blastoise': {
    a: [
      { name: 'Moomoo Milk', quantity: 2 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 5 },
      { name: 'Soothing Cacao', quantity: 3 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 7 },
      { name: 'Soothing Cacao', quantity: 5 },
      { name: 'Bean Sausage', quantity: 7 },
    ],
  },
  'Dugtrio': {
    a: [
      { name: 'Snoozy Tomato', quantity: 2 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 5 },
      { name: 'Large Leek', quantity: 3 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 7 },
      { name: 'Large Leek', quantity: 4 },
      { name: 'Greengrass Soybeans', quantity: 8 },
    ],
  },
  'Victreebel': {
    a: [
      { name: 'Snoozy Tomato', quantity: 2 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 5 },
      { name: 'Soft Potato', quantity: 4 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 7 },
      { name: 'Soft Potato', quantity: 6 },
      { name: 'Large Leek', quantity: 4 },
    ],
  },
  'Golem': {
    a: [
      { name: 'Greengrass Soybeans', quantity: 2 },
    ],
    b: [
      { name: 'Greengrass Soybeans', quantity: 5 },
      { name: 'Soft Potato', quantity: 4 },
    ],
    c: [
      { name: 'Greengrass Soybeans', quantity: 7 },
      { name: 'Soft Potato', quantity: 6 },
      { name: 'Tasty Mushroom', quantity: 4 },
    ],
  },
  'Farfetch\'d': {
    a: [
      { name: 'Large Leek', quantity: 2 },
    ],
    b: [
      { name: 'Large Leek', quantity: 5 },
      { name: 'Bean Sausage', quantity: 8 },
    ],
    c: [
      { name: 'Large Leek', quantity: 7 },
      { name: 'Bean Sausage', quantity: 13 },
      { name: 'Warming Ginger', quantity: 12 },
    ],
  },
  'Gengar': {
    a: [
      { name: 'Fiery Herb', quantity: 2 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 5 },
      { name: 'Tasty Mushroom', quantity: 4 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 7 },
      { name: 'Tasty Mushroom', quantity: 6 },
      { name: 'Pure Oil', quantity: 8 },
    ],
  },
  'Kangaskhan': {
    a: [
      { name: 'Warming Ginger', quantity: 2 },
    ],
    b: [
      { name: 'Warming Ginger', quantity: 5 },
      { name: 'Soft Potato', quantity: 4 },
    ],
    c: [
      { name: 'Warming Ginger', quantity: 7 },
      { name: 'Soft Potato', quantity: 6 },
      { name: 'Greengrass Soybeans', quantity: 8 },
    ],
  },
  'Mr. Mime': {
    a: [
      { name: 'Snoozy Tomato', quantity: 2 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 5 },
      { name: 'Soft Potato', quantity: 4 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 7 },
      { name: 'Soft Potato', quantity: 6 },
      { name: 'Large Leek', quantity: 4 },
    ],
  },
  'Pinsir': {
    a: [
      { name: 'Honey', quantity: 2 },
    ],
    b: [
      { name: 'Honey', quantity: 5 },
      { name: 'Fancy Apple', quantity: 5 },
    ],
    c: [
      { name: 'Honey', quantity: 7 },
      { name: 'Fancy Apple', quantity: 8 },
      { name: 'Bean Sausage', quantity: 7 },
    ],
  },
  'Ditto': {
    a: [
      { name: 'Pure Oil', quantity: 2 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 5 },
      { name: 'Large Leek', quantity: 3 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 7 },
      { name: 'Large Leek', quantity: 5 },
      { name: 'Slowpoke Tail', quantity: 3 },
    ],
  },
  'Dragonite': {
    a: [
      { name: 'Fiery Herb', quantity: 2 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 5 },
      { name: 'Greengrass Corn', quantity: 4 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 7 },
      { name: 'Greengrass Corn', quantity: 7 },
      { name: 'Pure Oil', quantity: 8 },
    ],
  },
  'Quagsire': {
    a: [
      { name: 'Tasty Mushroom', quantity: 2 },
    ],
    b: [
      { name: 'Tasty Mushroom', quantity: 5 },
      { name: 'Soft Potato', quantity: 6 },
    ],
    c: [
      { name: 'Tasty Mushroom', quantity: 7 },
      { name: 'Soft Potato', quantity: 10 },
      { name: 'Bean Sausage', quantity: 12 },
    ],
  },
  'Delibird': {
    a: [
      { name: 'Fancy Egg', quantity: 2 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 5 },
      { name: 'Fancy Apple', quantity: 6 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 7 },
      { name: 'Fancy Apple', quantity: 9 },
      { name: 'Soothing Cacao', quantity: 5 },
    ],
  },
  'Blissey': {
    a: [
      { name: 'Fancy Egg', quantity: 2 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 5 },
      { name: 'Soft Potato', quantity: 4 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 7 },
      { name: 'Soft Potato', quantity: 7 },
      { name: 'Honey', quantity: 8 },
    ],
  },
  'Pupitar': {
    a: [
      { name: 'Warming Ginger', quantity: 2 },
    ],
    b: [
      { name: 'Warming Ginger', quantity: 5 },
      { name: 'Greengrass Soybeans', quantity: 5 },
    ],
    c: [
      { name: 'Warming Ginger', quantity: 7 },
      { name: 'Greengrass Soybeans', quantity: 8 },
      { name: 'Bean Sausage', quantity: 8 },
    ],
  },
  'Tyranitar': {
    a: [
      { name: 'Warming Ginger', quantity: 2 },
    ],
    b: [
      { name: 'Warming Ginger', quantity: 5 },
      { name: 'Greengrass Soybeans', quantity: 5 },
    ],
    c: [
      { name: 'Warming Ginger', quantity: 7 },
      { name: 'Greengrass Soybeans', quantity: 8 },
      { name: 'Bean Sausage', quantity: 8 },
    ],
  },
  'Mawile': {
    a: [
      { name: 'Pure Oil', quantity: 2 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 5 },
      { name: 'Greengrass Corn', quantity: 4 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 7 },
      { name: 'Greengrass Corn', quantity: 6 },
      { name: 'Snoozy Tomato', quantity: 8 },
    ],
  },
  'Aggron': {
    a: [
      { name: 'Bean Sausage', quantity: 2 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 5 },
      { name: 'Rousing Coffee', quantity: 3 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 7 },
      { name: 'Rousing Coffee', quantity: 5 },
      { name: 'Greengrass Soybeans', quantity: 7 },
    ],
  },
  'Flygon': {
    a: [
      { name: 'Glossy Avocado', quantity: 2 },
    ],
    b: [
      { name: 'Glossy Avocado', quantity: 5 },
      { name: 'Fiery Herb', quantity: 6 },
    ],
    c: [
      { name: 'Glossy Avocado', quantity: 7 },
      { name: 'Fiery Herb', quantity: 9 },
      { name: 'Greengrass Soybeans', quantity: 12 },
    ],
  },
  'Absol': {
    a: [
      { name: 'Soothing Cacao', quantity: 2 },
    ],
    b: [
      { name: 'Soothing Cacao', quantity: 5 },
      { name: 'Fancy Apple', quantity: 8 },
    ],
    c: [
      { name: 'Soothing Cacao', quantity: 7 },
      { name: 'Fancy Apple', quantity: 12 },
      { name: 'Tasty Mushroom', quantity: 7 },
    ],
  },
  'Luxray': {
    a: [
      { name: 'Snoozy Tomato', quantity: 2 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 5 },
      { name: 'Pure Oil', quantity: 4 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 7 },
      { name: 'Pure Oil', quantity: 7 },
      { name: 'Rousing Coffee', quantity: 5 },
    ],
  },
  'Toxicroak': {
    a: [
      { name: 'Pure Oil', quantity: 2 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 5 },
      { name: 'Bean Sausage', quantity: 5 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 7 },
      { name: 'Bean Sausage', quantity: 8 },
    ],
  },
  'Abomasnow': {
    a: [
      { name: 'Snoozy Tomato', quantity: 2 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 5 },
      { name: 'Fancy Egg', quantity: 4 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 7 },
      { name: 'Fancy Egg', quantity: 7 },
      { name: 'Tasty Mushroom', quantity: 5 },
    ],
  },
  'Gourgeist (Small Variety)': {
    a: [
      { name: 'Plump Pumpkin', quantity: 2 },
    ],
    b: [
      { name: 'Plump Pumpkin', quantity: 5 },
      { name: 'Greengrass Soybeans', quantity: 11 },
    ],
    c: [
      { name: 'Plump Pumpkin', quantity: 7 },
      { name: 'Greengrass Soybeans', quantity: 18 },
      { name: 'Soft Potato', quantity: 15 },
    ],
  },
  'Gourgeist (Medium Variety)': {
    a: [
      { name: 'Plump Pumpkin', quantity: 2 },
    ],
    b: [
      { name: 'Plump Pumpkin', quantity: 5 },
      { name: 'Greengrass Soybeans', quantity: 11 },
    ],
    c: [
      { name: 'Plump Pumpkin', quantity: 7 },
      { name: 'Greengrass Soybeans', quantity: 18 },
      { name: 'Soft Potato', quantity: 15 },
    ],
  },
  'Gourgeist (Large Variety)': {
    a: [
      { name: 'Plump Pumpkin', quantity: 2 },
    ],
    b: [
      { name: 'Plump Pumpkin', quantity: 5 },
      { name: 'Greengrass Soybeans', quantity: 11 },
    ],
    c: [
      { name: 'Plump Pumpkin', quantity: 7 },
      { name: 'Greengrass Soybeans', quantity: 18 },
      { name: 'Soft Potato', quantity: 15 },
    ],
  },
  'Gourgeist (Jumbo Variety)': {
    a: [
      { name: 'Plump Pumpkin', quantity: 2 },
    ],
    b: [
      { name: 'Plump Pumpkin', quantity: 5 },
      { name: 'Greengrass Soybeans', quantity: 11 },
    ],
    c: [
      { name: 'Plump Pumpkin', quantity: 7 },
      { name: 'Greengrass Soybeans', quantity: 18 },
      { name: 'Soft Potato', quantity: 15 },
    ],
  },
  'Vikavolt': {
    a: [
      { name: 'Rousing Coffee', quantity: 2 },
    ],
    b: [
      { name: 'Rousing Coffee', quantity: 5 },
      { name: 'Tasty Mushroom', quantity: 4 },
    ],
    c: [
      { name: 'Rousing Coffee', quantity: 7 },
      { name: 'Tasty Mushroom', quantity: 7 },
      { name: 'Honey', quantity: 11 },
    ],
  },
  'Bewear': {
    a: [
      { name: 'Greengrass Corn', quantity: 2 },
    ],
    b: [
      { name: 'Greengrass Corn', quantity: 5 },
      { name: 'Bean Sausage', quantity: 6 },
    ],
    c: [
      { name: 'Greengrass Corn', quantity: 7 },
      { name: 'Bean Sausage', quantity: 10 },
      { name: 'Fancy Egg', quantity: 9 },
    ],
  },
  'Comfey': {
    a: [
      { name: 'Greengrass Corn', quantity: 2 },
    ],
    b: [
      { name: 'Greengrass Corn', quantity: 5 },
      { name: 'Warming Ginger', quantity: 6 },
    ],
    c: [
      { name: 'Greengrass Corn', quantity: 7 },
      { name: 'Warming Ginger', quantity: 9 },
      { name: 'Soothing Cacao', quantity: 7 },
    ],
  },
  'Cramorant': {
    a: [
      { name: 'Pure Oil', quantity: 2 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 5 },
      { name: 'Soft Potato', quantity: 4 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 7 },
      { name: 'Soft Potato', quantity: 7 },
      { name: 'Fancy Egg', quantity: 8 },
    ],
  },
  'Drampa': {
    a: [
      { name: 'Greengrass Soybeans', quantity: 2 },
    ],
    b: [
      { name: 'Greengrass Soybeans', quantity: 5 },
      { name: 'Glossy Avocado', quantity: 3 },
    ],
    c: [
      { name: 'Greengrass Soybeans', quantity: 7 },
      { name: 'Glossy Avocado', quantity: 4 },
      { name: 'Bean Sausage', quantity: 7 },
    ],
  },
  'Floragato': {
    a: [
      { name: 'Soft Potato', quantity: 2 },
    ],
    b: [
      { name: 'Soft Potato', quantity: 5 },
      { name: 'Moomoo Milk', quantity: 6 },
    ],
    c: [
      { name: 'Soft Potato', quantity: 7 },
      { name: 'Moomoo Milk', quantity: 9 },
      { name: 'Warming Ginger', quantity: 8 },
    ],
  },
  'Meowscarada': {
    a: [
      { name: 'Soft Potato', quantity: 2 },
    ],
    b: [
      { name: 'Soft Potato', quantity: 5 },
      { name: 'Moomoo Milk', quantity: 6 },
    ],
    c: [
      { name: 'Soft Potato', quantity: 7 },
      { name: 'Moomoo Milk', quantity: 9 },
      { name: 'Warming Ginger', quantity: 8 },
    ],
  },
  'Crocalor': {
    a: [
      { name: 'Fancy Apple', quantity: 2 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 5 },
      { name: 'Bean Sausage', quantity: 4 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 7 },
      { name: 'Bean Sausage', quantity: 6 },
      { name: 'Fiery Herb', quantity: 5 },
    ],
  },
  'Skeledirge': {
    a: [
      { name: 'Fancy Apple', quantity: 2 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 5 },
      { name: 'Bean Sausage', quantity: 4 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 7 },
      { name: 'Bean Sausage', quantity: 6 },
      { name: 'Fiery Herb', quantity: 5 },
    ],
  },
  'Quaxwell': {
    a: [
      { name: 'Greengrass Soybeans', quantity: 2 },
    ],
    b: [
      { name: 'Greengrass Soybeans', quantity: 5 },
      { name: 'Large Leek', quantity: 2 },
    ],
    c: [
      { name: 'Greengrass Soybeans', quantity: 7 },
      { name: 'Large Leek', quantity: 4 },
      { name: 'Pure Oil', quantity: 6 },
    ],
  },
  'Quaquaval': {
    a: [
      { name: 'Greengrass Soybeans', quantity: 2 },
    ],
    b: [
      { name: 'Greengrass Soybeans', quantity: 5 },
      { name: 'Large Leek', quantity: 2 },
    ],
    c: [
      { name: 'Greengrass Soybeans', quantity: 7 },
      { name: 'Large Leek', quantity: 4 },
      { name: 'Pure Oil', quantity: 6 },
    ],
  },
  'Cetitan': {
    a: [
      { name: 'Soft Potato', quantity: 2 },
    ],
    b: [
      { name: 'Soft Potato', quantity: 5 },
      { name: 'Bean Sausage', quantity: 5 },
    ],
    c: [
      { name: 'Soft Potato', quantity: 7 },
      { name: 'Bean Sausage', quantity: 9 },
      { name: 'Plump Pumpkin', quantity: 4 },
    ],
  },
  'Clodsire': {
    a: [
      { name: 'Soothing Cacao', quantity: 2 },
    ],
    b: [
      { name: 'Soothing Cacao', quantity: 5 },
      { name: 'Rousing Coffee', quantity: 4 },
    ],
    c: [
      { name: 'Soothing Cacao', quantity: 7 },
      { name: 'Rousing Coffee', quantity: 7 },
      { name: 'Soft Potato', quantity: 9 },
    ],
  },
  'Ribombee': {
    a: [
      { name: 'Honey', quantity: 2 },
    ],
    b: [
      { name: 'Honey', quantity: 5 },
      { name: 'Pure Oil', quantity: 4 },
    ],
    c: [
      { name: 'Honey', quantity: 7 },
      { name: 'Pure Oil', quantity: 6 },
      { name: 'Greengrass Corn', quantity: 5 },
    ],
  },
  'Bulbasaur': {
    a: [
      { name: 'Honey', quantity: 2 },
    ],
    b: [
      { name: 'Honey', quantity: 5 },
      { name: 'Snoozy Tomato', quantity: 4 },
    ],
    c: [
      { name: 'Honey', quantity: 7 },
      { name: 'Snoozy Tomato', quantity: 7 },
      { name: 'Soft Potato', quantity: 6 },
    ],
  },
  'Ivysaur': {
    a: [
      { name: 'Honey', quantity: 2 },
    ],
    b: [
      { name: 'Honey', quantity: 5 },
      { name: 'Snoozy Tomato', quantity: 4 },
    ],
    c: [
      { name: 'Honey', quantity: 7 },
      { name: 'Snoozy Tomato', quantity: 7 },
      { name: 'Soft Potato', quantity: 6 },
    ],
  },
  'Charmander': {
    a: [
      { name: 'Bean Sausage', quantity: 2 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 5 },
      { name: 'Warming Ginger', quantity: 4 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 7 },
      { name: 'Warming Ginger', quantity: 7 },
      { name: 'Fiery Herb', quantity: 6 },
    ],
  },
  'Charmeleon': {
    a: [
      { name: 'Bean Sausage', quantity: 2 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 5 },
      { name: 'Warming Ginger', quantity: 4 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 7 },
      { name: 'Warming Ginger', quantity: 7 },
      { name: 'Fiery Herb', quantity: 6 },
    ],
  },
  'Squirtle': {
    a: [
      { name: 'Moomoo Milk', quantity: 2 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 5 },
      { name: 'Soothing Cacao', quantity: 3 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 7 },
      { name: 'Soothing Cacao', quantity: 5 },
      { name: 'Bean Sausage', quantity: 7 },
    ],
  },
  'Wartortle': {
    a: [
      { name: 'Moomoo Milk', quantity: 2 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 5 },
      { name: 'Soothing Cacao', quantity: 3 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 7 },
      { name: 'Soothing Cacao', quantity: 5 },
      { name: 'Bean Sausage', quantity: 7 },
    ],
  },
  'Diglett': {
    a: [
      { name: 'Snoozy Tomato', quantity: 2 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 5 },
      { name: 'Large Leek', quantity: 3 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 7 },
      { name: 'Large Leek', quantity: 4 },
      { name: 'Greengrass Soybeans', quantity: 8 },
    ],
  },
  'Bellsprout': {
    a: [
      { name: 'Snoozy Tomato', quantity: 2 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 5 },
      { name: 'Soft Potato', quantity: 4 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 7 },
      { name: 'Soft Potato', quantity: 6 },
      { name: 'Large Leek', quantity: 4 },
    ],
  },
  'Weepinbell': {
    a: [
      { name: 'Snoozy Tomato', quantity: 2 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 5 },
      { name: 'Soft Potato', quantity: 4 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 7 },
      { name: 'Soft Potato', quantity: 6 },
      { name: 'Large Leek', quantity: 4 },
    ],
  },
  'Geodude': {
    a: [
      { name: 'Greengrass Soybeans', quantity: 2 },
    ],
    b: [
      { name: 'Greengrass Soybeans', quantity: 5 },
      { name: 'Soft Potato', quantity: 4 },
    ],
    c: [
      { name: 'Greengrass Soybeans', quantity: 7 },
      { name: 'Soft Potato', quantity: 6 },
      { name: 'Tasty Mushroom', quantity: 4 },
    ],
  },
  'Graveler': {
    a: [
      { name: 'Greengrass Soybeans', quantity: 2 },
    ],
    b: [
      { name: 'Greengrass Soybeans', quantity: 5 },
      { name: 'Soft Potato', quantity: 4 },
    ],
    c: [
      { name: 'Greengrass Soybeans', quantity: 7 },
      { name: 'Soft Potato', quantity: 6 },
      { name: 'Tasty Mushroom', quantity: 4 },
    ],
  },
  'Gastly': {
    a: [
      { name: 'Fiery Herb', quantity: 2 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 5 },
      { name: 'Tasty Mushroom', quantity: 4 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 7 },
      { name: 'Tasty Mushroom', quantity: 6 },
      { name: 'Pure Oil', quantity: 8 },
    ],
  },
  'Haunter': {
    a: [
      { name: 'Fiery Herb', quantity: 2 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 5 },
      { name: 'Tasty Mushroom', quantity: 4 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 7 },
      { name: 'Tasty Mushroom', quantity: 6 },
      { name: 'Pure Oil', quantity: 8 },
    ],
  },
  'Chansey': {
    a: [
      { name: 'Fancy Egg', quantity: 2 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 5 },
      { name: 'Soft Potato', quantity: 4 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 7 },
      { name: 'Soft Potato', quantity: 7 },
      { name: 'Honey', quantity: 8 },
    ],
  },
  'Dratini': {
    a: [
      { name: 'Fiery Herb', quantity: 2 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 5 },
      { name: 'Greengrass Corn', quantity: 4 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 7 },
      { name: 'Greengrass Corn', quantity: 7 },
      { name: 'Pure Oil', quantity: 8 },
    ],
  },
  'Dragonair': {
    a: [
      { name: 'Fiery Herb', quantity: 2 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 5 },
      { name: 'Greengrass Corn', quantity: 4 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 7 },
      { name: 'Greengrass Corn', quantity: 7 },
      { name: 'Pure Oil', quantity: 8 },
    ],
  },
  'Wooper': {
    a: [
      { name: 'Tasty Mushroom', quantity: 2 },
    ],
    b: [
      { name: 'Tasty Mushroom', quantity: 5 },
      { name: 'Soft Potato', quantity: 6 },
    ],
    c: [
      { name: 'Tasty Mushroom', quantity: 7 },
      { name: 'Soft Potato', quantity: 10 },
      { name: 'Bean Sausage', quantity: 12 },
    ],
  },
  'Wooper (Paldean Form)': {
    a: [
      { name: 'Soothing Cacao', quantity: 2 },
    ],
    b: [
      { name: 'Soothing Cacao', quantity: 5 },
      { name: 'Rousing Coffee', quantity: 4 },
    ],
    c: [
      { name: 'Soothing Cacao', quantity: 7 },
      { name: 'Rousing Coffee', quantity: 7 },
      { name: 'Soft Potato', quantity: 9 },
    ],
  },
  'Larvitar': {
    a: [
      { name: 'Warming Ginger', quantity: 2 },
    ],
    b: [
      { name: 'Warming Ginger', quantity: 5 },
      { name: 'Greengrass Soybeans', quantity: 5 },
    ],
    c: [
      { name: 'Warming Ginger', quantity: 7 },
      { name: 'Greengrass Soybeans', quantity: 8 },
      { name: 'Bean Sausage', quantity: 8 },
    ],
  },
  'Aron': {
    a: [
      { name: 'Bean Sausage', quantity: 2 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 5 },
      { name: 'Rousing Coffee', quantity: 3 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 7 },
      { name: 'Rousing Coffee', quantity: 5 },
      { name: 'Greengrass Soybeans', quantity: 7 },
    ],
  },
  'Lairon': {
    a: [
      { name: 'Bean Sausage', quantity: 2 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 5 },
      { name: 'Rousing Coffee', quantity: 3 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 7 },
      { name: 'Rousing Coffee', quantity: 5 },
      { name: 'Greengrass Soybeans', quantity: 7 },
    ],
  },
  'Trapinch': {
    a: [
      { name: 'Glossy Avocado', quantity: 2 },
    ],
    b: [
      { name: 'Glossy Avocado', quantity: 5 },
      { name: 'Fiery Herb', quantity: 6 },
    ],
    c: [
      { name: 'Glossy Avocado', quantity: 7 },
      { name: 'Fiery Herb', quantity: 9 },
      { name: 'Greengrass Soybeans', quantity: 12 },
    ],
  },
  'Vibrava': {
    a: [
      { name: 'Glossy Avocado', quantity: 2 },
    ],
    b: [
      { name: 'Glossy Avocado', quantity: 5 },
      { name: 'Fiery Herb', quantity: 6 },
    ],
    c: [
      { name: 'Glossy Avocado', quantity: 7 },
      { name: 'Fiery Herb', quantity: 9 },
      { name: 'Greengrass Soybeans', quantity: 12 },
    ],
  },
  'Shinx': {
    a: [
      { name: 'Snoozy Tomato', quantity: 2 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 5 },
      { name: 'Pure Oil', quantity: 4 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 7 },
      { name: 'Pure Oil', quantity: 7 },
      { name: 'Rousing Coffee', quantity: 5 },
    ],
  },
  'Luxio': {
    a: [
      { name: 'Snoozy Tomato', quantity: 2 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 5 },
      { name: 'Pure Oil', quantity: 4 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 7 },
      { name: 'Pure Oil', quantity: 7 },
      { name: 'Rousing Coffee', quantity: 5 },
    ],
  },
  'Mime Jr.': {
    a: [
      { name: 'Snoozy Tomato', quantity: 2 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 5 },
      { name: 'Soft Potato', quantity: 4 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 7 },
      { name: 'Soft Potato', quantity: 6 },
      { name: 'Large Leek', quantity: 4 },
    ],
  },
  'Happiny': {
    a: [
      { name: 'Fancy Egg', quantity: 2 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 5 },
      { name: 'Soft Potato', quantity: 4 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 7 },
      { name: 'Soft Potato', quantity: 7 },
      { name: 'Honey', quantity: 8 },
    ],
  },
  'Spiritomb': {
    a: [
      { name: 'Tasty Mushroom', quantity: 2 },
    ],
    b: [
      { name: 'Tasty Mushroom', quantity: 5 },
      { name: 'Plump Pumpkin', quantity: 3 },
    ],
    c: [
      { name: 'Tasty Mushroom', quantity: 7 },
      { name: 'Plump Pumpkin', quantity: 5 },
      { name: 'Large Leek', quantity: 6 },
    ],
  },
  'Croagunk': {
    a: [
      { name: 'Pure Oil', quantity: 2 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 5 },
      { name: 'Bean Sausage', quantity: 5 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 7 },
      { name: 'Bean Sausage', quantity: 8 },
    ],
  },
  'Snover': {
    a: [
      { name: 'Snoozy Tomato', quantity: 2 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 5 },
      { name: 'Fancy Egg', quantity: 4 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 7 },
      { name: 'Fancy Egg', quantity: 7 },
      { name: 'Tasty Mushroom', quantity: 5 },
    ],
  },
  'Pumpkaboo (Small Variety)': {
    a: [
      { name: 'Plump Pumpkin', quantity: 2 },
    ],
    b: [
      { name: 'Plump Pumpkin', quantity: 5 },
      { name: 'Greengrass Soybeans', quantity: 11 },
    ],
    c: [
      { name: 'Plump Pumpkin', quantity: 7 },
      { name: 'Greengrass Soybeans', quantity: 18 },
      { name: 'Soft Potato', quantity: 15 },
    ],
  },
  'Pumpkaboo (Medium Variety)': {
    a: [
      { name: 'Plump Pumpkin', quantity: 2 },
    ],
    b: [
      { name: 'Plump Pumpkin', quantity: 5 },
      { name: 'Greengrass Soybeans', quantity: 11 },
    ],
    c: [
      { name: 'Plump Pumpkin', quantity: 7 },
      { name: 'Greengrass Soybeans', quantity: 18 },
      { name: 'Soft Potato', quantity: 15 },
    ],
  },
  'Pumpkaboo (Large Variety)': {
    a: [
      { name: 'Plump Pumpkin', quantity: 2 },
    ],
    b: [
      { name: 'Plump Pumpkin', quantity: 5 },
      { name: 'Greengrass Soybeans', quantity: 11 },
    ],
    c: [
      { name: 'Plump Pumpkin', quantity: 7 },
      { name: 'Greengrass Soybeans', quantity: 18 },
      { name: 'Soft Potato', quantity: 15 },
    ],
  },
  'Pumpkaboo (Jumbo Variety)': {
    a: [
      { name: 'Plump Pumpkin', quantity: 2 },
    ],
    b: [
      { name: 'Plump Pumpkin', quantity: 5 },
      { name: 'Greengrass Soybeans', quantity: 11 },
    ],
    c: [
      { name: 'Plump Pumpkin', quantity: 7 },
      { name: 'Greengrass Soybeans', quantity: 18 },
      { name: 'Soft Potato', quantity: 15 },
    ],
  },
  'Grubbin': {
    a: [
      { name: 'Rousing Coffee', quantity: 2 },
    ],
    b: [
      { name: 'Rousing Coffee', quantity: 5 },
      { name: 'Tasty Mushroom', quantity: 4 },
    ],
    c: [
      { name: 'Rousing Coffee', quantity: 7 },
      { name: 'Tasty Mushroom', quantity: 7 },
      { name: 'Honey', quantity: 11 },
    ],
  },
  'Cutiefly': {
    a: [
      { name: 'Honey', quantity: 2 },
    ],
    b: [
      { name: 'Honey', quantity: 5 },
      { name: 'Pure Oil', quantity: 4 },
    ],
    c: [
      { name: 'Honey', quantity: 7 },
      { name: 'Pure Oil', quantity: 6 },
      { name: 'Greengrass Corn', quantity: 5 },
    ],
  },
  'Charjabug': {
    a: [
      { name: 'Rousing Coffee', quantity: 2 },
    ],
    b: [
      { name: 'Rousing Coffee', quantity: 5 },
      { name: 'Tasty Mushroom', quantity: 4 },
    ],
    c: [
      { name: 'Rousing Coffee', quantity: 7 },
      { name: 'Tasty Mushroom', quantity: 7 },
      { name: 'Honey', quantity: 11 },
    ],
  },
  'Stufful': {
    a: [
      { name: 'Greengrass Corn', quantity: 2 },
    ],
    b: [
      { name: 'Greengrass Corn', quantity: 5 },
      { name: 'Bean Sausage', quantity: 6 },
    ],
    c: [
      { name: 'Greengrass Corn', quantity: 7 },
      { name: 'Bean Sausage', quantity: 10 },
      { name: 'Fancy Egg', quantity: 9 },
    ],
  },
  'Sprigatito': {
    a: [
      { name: 'Soft Potato', quantity: 2 },
    ],
    b: [
      { name: 'Soft Potato', quantity: 5 },
      { name: 'Moomoo Milk', quantity: 6 },
    ],
    c: [
      { name: 'Soft Potato', quantity: 7 },
      { name: 'Moomoo Milk', quantity: 9 },
      { name: 'Warming Ginger', quantity: 8 },
    ],
  },
  'Fuecoco': {
    a: [
      { name: 'Fancy Apple', quantity: 2 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 5 },
      { name: 'Bean Sausage', quantity: 4 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 7 },
      { name: 'Bean Sausage', quantity: 6 },
      { name: 'Fiery Herb', quantity: 5 },
    ],
  },
  'Quaxly': {
    a: [
      { name: 'Greengrass Soybeans', quantity: 2 },
    ],
    b: [
      { name: 'Greengrass Soybeans', quantity: 5 },
      { name: 'Large Leek', quantity: 2 },
    ],
    c: [
      { name: 'Greengrass Soybeans', quantity: 7 },
      { name: 'Large Leek', quantity: 4 },
      { name: 'Pure Oil', quantity: 6 },
    ],
  },
  'Cetoddle': {
    a: [
      { name: 'Soft Potato', quantity: 2 },
    ],
    b: [
      { name: 'Soft Potato', quantity: 5 },
      { name: 'Bean Sausage', quantity: 5 },
    ],
    c: [
      { name: 'Soft Potato', quantity: 7 },
      { name: 'Bean Sausage', quantity: 9 },
      { name: 'Plump Pumpkin', quantity: 4 },
    ],
  },
  'Wigglytuff': {
    a: [
      { name: 'Honey', quantity: 1 },
    ],
    b: [
      { name: 'Honey', quantity: 2 },
      { name: 'Pure Oil', quantity: 2 },
    ],
    c: [
      { name: 'Honey', quantity: 4 },
      { name: 'Pure Oil', quantity: 3 },
      { name: 'Soothing Cacao', quantity: 2 },
    ],
  },
  'Persian': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Bean Sausage', quantity: 2 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Golduck': {
    a: [
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    b: [
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Fancy Apple', quantity: 4 },
    ],
    c: [
      { name: 'Soothing Cacao', quantity: 4 },
      { name: 'Fancy Apple', quantity: 6 },
      { name: 'Bean Sausage', quantity: 5 },
    ],
  },
  'Arcanine': {
    a: [
      { name: 'Fiery Herb', quantity: 1 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 4 },
      { name: 'Bean Sausage', quantity: 5 },
      { name: 'Moomoo Milk', quantity: 5 },
    ],
  },
  'Slowbro': {
    a: [
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    b: [
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Slowpoke Tail', quantity: 1 },
    ],
    c: [
      { name: 'Soothing Cacao', quantity: 4 },
      { name: 'Slowpoke Tail', quantity: 2 },
      { name: 'Snoozy Tomato', quantity: 5 },
    ],
  },
  'Eevee (Halloween)': {
    a: [
      { name: 'Plump Pumpkin', quantity: 1 },
    ],
    b: [
      { name: 'Plump Pumpkin', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 4 },
    ],
    c: [
      { name: 'Plump Pumpkin', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 6 },
      { name: 'Moomoo Milk', quantity: 9 },
    ],
  },
  'Vaporeon': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Jolteon': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Flareon': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Ampharos': {
    a: [
      { name: 'Fiery Herb', quantity: 1 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 2 },
      { name: 'Fancy Egg', quantity: 3 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 4 },
      { name: 'Fancy Egg', quantity: 4 },
    ],
  },
  'Sudowoodo': {
    a: [
      { name: 'Snoozy Tomato', quantity: 1 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 2 },
      { name: 'Greengrass Soybeans', quantity: 2 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 4 },
      { name: 'Greengrass Soybeans', quantity: 4 },
      { name: 'Tasty Mushroom', quantity: 2 },
    ],
  },
  'Espeon': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Umbreon': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Slowking': {
    a: [
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    b: [
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Slowpoke Tail', quantity: 1 },
    ],
    c: [
      { name: 'Soothing Cacao', quantity: 4 },
      { name: 'Slowpoke Tail', quantity: 2 },
      { name: 'Snoozy Tomato', quantity: 5 },
    ],
  },
  'Wobbuffet': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Tasty Mushroom', quantity: 1 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Tasty Mushroom', quantity: 2 },
      { name: 'Pure Oil', quantity: 3 },
    ],
  },
  'Shuckle': {
    a: [
      { name: 'Pure Oil', quantity: 1 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 2 },
      { name: 'Rousing Coffee', quantity: 2 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 4 },
      { name: 'Rousing Coffee', quantity: 3 },
      { name: 'Honey', quantity: 4 },
    ],
  },
  'Heracross': {
    a: [
      { name: 'Honey', quantity: 1 },
    ],
    b: [
      { name: 'Honey', quantity: 2 },
      { name: 'Tasty Mushroom', quantity: 1 },
    ],
    c: [
      { name: 'Honey', quantity: 4 },
      { name: 'Tasty Mushroom', quantity: 2 },
      { name: 'Bean Sausage', quantity: 4 },
    ],
  },
  'Sceptile': {
    a: [
      { name: 'Fancy Egg', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 2 },
      { name: 'Rousing Coffee', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 4 },
      { name: 'Rousing Coffee', quantity: 3 },
      { name: 'Large Leek', quantity: 2 },
    ],
  },
  'Torterra': {
    a: [
      { name: 'Tasty Mushroom', quantity: 1 },
    ],
    b: [
      { name: 'Tasty Mushroom', quantity: 2 },
      { name: 'Soft Potato', quantity: 3 },
    ],
    c: [
      { name: 'Tasty Mushroom', quantity: 4 },
      { name: 'Soft Potato', quantity: 5 },
      { name: 'Warming Ginger', quantity: 6 },
    ],
  },
  'Infernape': {
    a: [
      { name: 'Fiery Herb', quantity: 1 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 2 },
      { name: 'Warming Ginger', quantity: 3 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Rousing Coffee', quantity: 3 },
    ],
  },
  'Gardevoir': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Greengrass Corn', quantity: 1 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Greengrass Corn', quantity: 2 },
      { name: 'Large Leek', quantity: 2 },
    ],
  },
  'Sableye': {
    a: [
      { name: 'Pure Oil', quantity: 1 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 2 },
      { name: 'Tasty Mushroom', quantity: 2 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 4 },
      { name: 'Tasty Mushroom', quantity: 3 },
      { name: 'Soothing Cacao', quantity: 3 },
    ],
  },
  'Plusle': {
    a: [
      { name: 'Rousing Coffee', quantity: 1 },
    ],
    b: [
      { name: 'Rousing Coffee', quantity: 2 },
      { name: 'Large Leek', quantity: 2 },
    ],
    c: [
      { name: 'Rousing Coffee', quantity: 4 },
      { name: 'Large Leek', quantity: 3 },
      { name: 'Moomoo Milk', quantity: 6 },
    ],
  },
  'Minun': {
    a: [
      { name: 'Honey', quantity: 1 },
    ],
    b: [
      { name: 'Honey', quantity: 2 },
      { name: 'Fancy Egg', quantity: 2 },
    ],
    c: [
      { name: 'Honey', quantity: 4 },
      { name: 'Fancy Egg', quantity: 3 },
      { name: 'Moomoo Milk', quantity: 4 },
    ],
  },
  'Swalot': {
    a: [
      { name: 'Greengrass Soybeans', quantity: 1 },
    ],
    b: [
      { name: 'Greengrass Soybeans', quantity: 2 },
      { name: 'Tasty Mushroom', quantity: 1 },
    ],
    c: [
      { name: 'Greengrass Soybeans', quantity: 4 },
      { name: 'Tasty Mushroom', quantity: 2 },
      { name: 'Honey', quantity: 4 },
    ],
  },
  'Spheal (Holiday)': {
    a: [
      { name: 'Pure Oil', quantity: 1 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 4 },
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
    ],
  },
  'Drifblim': {
    a: [
      { name: 'Greengrass Corn', quantity: 1 },
    ],
    b: [
      { name: 'Greengrass Corn', quantity: 2 },
      { name: 'Pure Oil', quantity: 3 },
    ],
    c: [
      { name: 'Greengrass Corn', quantity: 4 },
      { name: 'Pure Oil', quantity: 4 },
      { name: 'Soft Potato', quantity: 4 },
    ],
  },
  'Honchkrow': {
    a: [
      { name: 'Rousing Coffee', quantity: 1 },
    ],
    b: [
      { name: 'Rousing Coffee', quantity: 2 },
      { name: 'Greengrass Soybeans', quantity: 3 },
    ],
    c: [
      { name: 'Rousing Coffee', quantity: 4 },
      { name: 'Greengrass Soybeans', quantity: 6 },
      { name: 'Fiery Herb', quantity: 4 },
    ],
  },
  'Lucario': {
    a: [
      { name: 'Pure Oil', quantity: 1 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 2 },
      { name: 'Soft Potato', quantity: 2 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 4 },
      { name: 'Soft Potato', quantity: 4 },
      { name: 'Fancy Egg', quantity: 4 },
    ],
  },
  'Magnezone': {
    a: [
      { name: 'Pure Oil', quantity: 1 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 2 },
      { name: 'Fiery Herb', quantity: 2 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 4 },
      { name: 'Fiery Herb', quantity: 3 },
    ],
  },
  'Togekiss': {
    a: [
      { name: 'Fancy Egg', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 2 },
      { name: 'Warming Ginger', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 3 },
    ],
  },
  'Leafeon': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Glaceon': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Gallade': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Greengrass Corn', quantity: 1 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Greengrass Corn', quantity: 2 },
      { name: 'Large Leek', quantity: 2 },
    ],
  },
  'Crustle': {
    a: [
      { name: 'Glossy Avocado', quantity: 1 },
    ],
    b: [
      { name: 'Glossy Avocado', quantity: 2 },
      { name: 'Soft Potato', quantity: 3 },
    ],
    c: [
      { name: 'Glossy Avocado', quantity: 4 },
      { name: 'Soft Potato', quantity: 5 },
      { name: 'Pure Oil', quantity: 5 },
    ],
  },
  'Sandslash': {
    a: [
      { name: 'Plump Pumpkin', quantity: 1 },
    ],
    b: [
      { name: 'Plump Pumpkin', quantity: 2 },
      { name: 'Greengrass Corn', quantity: 4 },
    ],
    c: [
      { name: 'Plump Pumpkin', quantity: 4 },
      { name: 'Greengrass Corn', quantity: 6 },
      { name: 'Soft Potato', quantity: 7 },
    ],
  },
  'Braviary': {
    a: [
      { name: 'Bean Sausage', quantity: 1 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 2 },
      { name: 'Greengrass Corn', quantity: 2 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Greengrass Corn', quantity: 3 },
      { name: 'Rousing Coffee', quantity: 2 },
    ],
  },
  'Sylveon': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Hawlucha': {
    a: [
      { name: 'Fiery Herb', quantity: 1 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 2 },
      { name: 'Warming Ginger', quantity: 3 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Bean Sausage', quantity: 5 },
    ],
  },
  'Dedenne': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Greengrass Corn', quantity: 2 },
    ],
  },
  'Togedemaru': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Glossy Avocado', quantity: 1 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Glossy Avocado', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 2 },
    ],
  },
  'Mimikyu': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Rousing Coffee', quantity: 1 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Rousing Coffee', quantity: 2 },
      { name: 'Tasty Mushroom', quantity: 2 },
    ],
  },
  'Toxtricity (Amped Form)': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Fancy Apple', quantity: 2 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Large Leek', quantity: 2 },
    ],
  },
  'Toxtricity (Low Key Form)': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Fancy Apple', quantity: 2 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Large Leek', quantity: 2 },
    ],
  },
  'Pawmot': {
    a: [
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    b: [
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Moomoo Milk', quantity: 3 },
    ],
    c: [
      { name: 'Soothing Cacao', quantity: 4 },
      { name: 'Moomoo Milk', quantity: 6 },
      { name: 'Fancy Egg', quantity: 5 },
    ],
  },
  'Pikachu (Holiday)': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Warming Ginger', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Warming Ginger', quantity: 3 },
      { name: 'Fancy Egg', quantity: 3 },
    ],
  },
  'Jigglypuff': {
    a: [
      { name: 'Honey', quantity: 1 },
    ],
    b: [
      { name: 'Honey', quantity: 2 },
      { name: 'Pure Oil', quantity: 2 },
    ],
    c: [
      { name: 'Honey', quantity: 4 },
      { name: 'Pure Oil', quantity: 3 },
      { name: 'Soothing Cacao', quantity: 2 },
    ],
  },
  'Meowth': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Bean Sausage', quantity: 2 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Psyduck': {
    a: [
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    b: [
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Fancy Apple', quantity: 4 },
    ],
    c: [
      { name: 'Soothing Cacao', quantity: 4 },
      { name: 'Fancy Apple', quantity: 6 },
      { name: 'Bean Sausage', quantity: 5 },
    ],
  },
  'Growlithe': {
    a: [
      { name: 'Fiery Herb', quantity: 1 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 4 },
      { name: 'Bean Sausage', quantity: 5 },
      { name: 'Moomoo Milk', quantity: 5 },
    ],
  },
  'Slowpoke': {
    a: [
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    b: [
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Slowpoke Tail', quantity: 1 },
    ],
    c: [
      { name: 'Soothing Cacao', quantity: 4 },
      { name: 'Slowpoke Tail', quantity: 2 },
      { name: 'Snoozy Tomato', quantity: 5 },
    ],
  },
  'Magnemite': {
    a: [
      { name: 'Pure Oil', quantity: 1 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 2 },
      { name: 'Fiery Herb', quantity: 2 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 4 },
      { name: 'Fiery Herb', quantity: 3 },
    ],
  },
  'Magneton': {
    a: [
      { name: 'Pure Oil', quantity: 1 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 2 },
      { name: 'Fiery Herb', quantity: 2 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 4 },
      { name: 'Fiery Herb', quantity: 3 },
    ],
  },
  'Eevee': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Igglybuff': {
    a: [
      { name: 'Honey', quantity: 1 },
    ],
    b: [
      { name: 'Honey', quantity: 2 },
      { name: 'Pure Oil', quantity: 2 },
    ],
    c: [
      { name: 'Honey', quantity: 4 },
      { name: 'Pure Oil', quantity: 3 },
      { name: 'Soothing Cacao', quantity: 2 },
    ],
  },
  'Togepi': {
    a: [
      { name: 'Fancy Egg', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 2 },
      { name: 'Warming Ginger', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 3 },
    ],
  },
  'Togetic': {
    a: [
      { name: 'Fancy Egg', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 2 },
      { name: 'Warming Ginger', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Soothing Cacao', quantity: 3 },
    ],
  },
  'Mareep': {
    a: [
      { name: 'Fiery Herb', quantity: 1 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 2 },
      { name: 'Fancy Egg', quantity: 3 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 4 },
      { name: 'Fancy Egg', quantity: 4 },
    ],
  },
  'Flaaffy': {
    a: [
      { name: 'Fiery Herb', quantity: 1 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 2 },
      { name: 'Fancy Egg', quantity: 3 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 4 },
      { name: 'Fancy Egg', quantity: 4 },
    ],
  },
  'Murkrow': {
    a: [
      { name: 'Rousing Coffee', quantity: 1 },
    ],
    b: [
      { name: 'Rousing Coffee', quantity: 2 },
      { name: 'Greengrass Soybeans', quantity: 3 },
    ],
    c: [
      { name: 'Rousing Coffee', quantity: 4 },
      { name: 'Greengrass Soybeans', quantity: 6 },
      { name: 'Fiery Herb', quantity: 4 },
    ],
  },
  'Noibat': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Large Leek', quantity: 1 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Large Leek', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Noivern': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Large Leek', quantity: 1 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Large Leek', quantity: 2 },
      { name: 'Bean Sausage', quantity: 3 },
    ],
  },
  'Treecko': {
    a: [
      { name: 'Fancy Egg', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 2 },
      { name: 'Rousing Coffee', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 4 },
      { name: 'Rousing Coffee', quantity: 3 },
      { name: 'Large Leek', quantity: 2 },
    ],
  },
  'Grovyle': {
    a: [
      { name: 'Fancy Egg', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Egg', quantity: 2 },
      { name: 'Rousing Coffee', quantity: 2 },
    ],
    c: [
      { name: 'Fancy Egg', quantity: 4 },
      { name: 'Rousing Coffee', quantity: 3 },
      { name: 'Large Leek', quantity: 2 },
    ],
  },
  'Turtwig': {
    a: [
      { name: 'Tasty Mushroom', quantity: 1 },
    ],
    b: [
      { name: 'Tasty Mushroom', quantity: 2 },
      { name: 'Soft Potato', quantity: 3 },
    ],
    c: [
      { name: 'Tasty Mushroom', quantity: 4 },
      { name: 'Soft Potato', quantity: 5 },
      { name: 'Warming Ginger', quantity: 6 },
    ],
  },
  'Grotle': {
    a: [
      { name: 'Tasty Mushroom', quantity: 1 },
    ],
    b: [
      { name: 'Tasty Mushroom', quantity: 2 },
      { name: 'Soft Potato', quantity: 3 },
    ],
    c: [
      { name: 'Tasty Mushroom', quantity: 4 },
      { name: 'Soft Potato', quantity: 5 },
      { name: 'Warming Ginger', quantity: 6 },
    ],
  },
  'Chimchar': {
    a: [
      { name: 'Fiery Herb', quantity: 1 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 2 },
      { name: 'Warming Ginger', quantity: 3 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Rousing Coffee', quantity: 3 },
    ],
  },
  'Monferno': {
    a: [
      { name: 'Fiery Herb', quantity: 1 },
    ],
    b: [
      { name: 'Fiery Herb', quantity: 2 },
      { name: 'Warming Ginger', quantity: 3 },
    ],
    c: [
      { name: 'Fiery Herb', quantity: 4 },
      { name: 'Warming Ginger', quantity: 4 },
      { name: 'Rousing Coffee', quantity: 3 },
    ],
  },
  'Ralts': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Greengrass Corn', quantity: 1 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Greengrass Corn', quantity: 2 },
      { name: 'Large Leek', quantity: 2 },
    ],
  },
  'Kirlia': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Greengrass Corn', quantity: 1 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Greengrass Corn', quantity: 2 },
      { name: 'Large Leek', quantity: 2 },
    ],
  },
  'Gulpin': {
    a: [
      { name: 'Greengrass Soybeans', quantity: 1 },
    ],
    b: [
      { name: 'Greengrass Soybeans', quantity: 2 },
      { name: 'Tasty Mushroom', quantity: 1 },
    ],
    c: [
      { name: 'Greengrass Soybeans', quantity: 4 },
      { name: 'Tasty Mushroom', quantity: 2 },
      { name: 'Honey', quantity: 4 },
    ],
  },
  'Wynaut': {
    a: [
      { name: 'Fancy Apple', quantity: 1 },
    ],
    b: [
      { name: 'Fancy Apple', quantity: 2 },
      { name: 'Tasty Mushroom', quantity: 1 },
    ],
    c: [
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Tasty Mushroom', quantity: 2 },
      { name: 'Pure Oil', quantity: 3 },
    ],
  },
  'Bonsly': {
    a: [
      { name: 'Snoozy Tomato', quantity: 1 },
    ],
    b: [
      { name: 'Snoozy Tomato', quantity: 2 },
      { name: 'Greengrass Soybeans', quantity: 2 },
    ],
    c: [
      { name: 'Snoozy Tomato', quantity: 4 },
      { name: 'Greengrass Soybeans', quantity: 4 },
      { name: 'Tasty Mushroom', quantity: 2 },
    ],
  },
  'Drifloon': {
    a: [
      { name: 'Greengrass Corn', quantity: 1 },
    ],
    b: [
      { name: 'Greengrass Corn', quantity: 2 },
      { name: 'Pure Oil', quantity: 3 },
    ],
    c: [
      { name: 'Greengrass Corn', quantity: 4 },
      { name: 'Pure Oil', quantity: 4 },
      { name: 'Soft Potato', quantity: 4 },
    ],
  },
  'Riolu': {
    a: [
      { name: 'Pure Oil', quantity: 1 },
    ],
    b: [
      { name: 'Pure Oil', quantity: 2 },
      { name: 'Soft Potato', quantity: 2 },
    ],
    c: [
      { name: 'Pure Oil', quantity: 4 },
      { name: 'Soft Potato', quantity: 4 },
      { name: 'Fancy Egg', quantity: 4 },
    ],
  },
  'Dwebble': {
    a: [
      { name: 'Glossy Avocado', quantity: 1 },
    ],
    b: [
      { name: 'Glossy Avocado', quantity: 2 },
      { name: 'Soft Potato', quantity: 3 },
    ],
    c: [
      { name: 'Glossy Avocado', quantity: 4 },
      { name: 'Soft Potato', quantity: 5 },
      { name: 'Pure Oil', quantity: 5 },
    ],
  },
  'Rufflet': {
    a: [
      { name: 'Bean Sausage', quantity: 1 },
    ],
    b: [
      { name: 'Bean Sausage', quantity: 2 },
      { name: 'Greengrass Corn', quantity: 2 },
    ],
    c: [
      { name: 'Bean Sausage', quantity: 4 },
      { name: 'Greengrass Corn', quantity: 3 },
      { name: 'Rousing Coffee', quantity: 2 },
    ],
  },
  'Sandshrew': {
    a: [
      { name: 'Plump Pumpkin', quantity: 1 },
    ],
    b: [
      { name: 'Plump Pumpkin', quantity: 2 },
      { name: 'Greengrass Corn', quantity: 4 },
    ],
    c: [
      { name: 'Plump Pumpkin', quantity: 4 },
      { name: 'Greengrass Corn', quantity: 6 },
      { name: 'Soft Potato', quantity: 7 },
    ],
  },
  'Toxel': {
    a: [
      { name: 'Moomoo Milk', quantity: 1 },
    ],
    b: [
      { name: 'Moomoo Milk', quantity: 2 },
      { name: 'Fancy Apple', quantity: 2 },
    ],
    c: [
      { name: 'Moomoo Milk', quantity: 4 },
      { name: 'Fancy Apple', quantity: 4 },
      { name: 'Large Leek', quantity: 2 },
    ],
  },
  'Pawmi': {
    a: [
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    b: [
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Moomoo Milk', quantity: 3 },
    ],
    c: [
      { name: 'Soothing Cacao', quantity: 4 },
      { name: 'Moomoo Milk', quantity: 6 },
      { name: 'Fancy Egg', quantity: 5 },
    ],
  },
  'Pawmo': {
    a: [
      { name: 'Soothing Cacao', quantity: 1 },
    ],
    b: [
      { name: 'Soothing Cacao', quantity: 2 },
      { name: 'Moomoo Milk', quantity: 3 },
    ],
    c: [
      { name: 'Soothing Cacao', quantity: 4 },
      { name: 'Moomoo Milk', quantity: 6 },
      { name: 'Fancy Egg', quantity: 5 },
    ],
  },
}

export function getIngredientSlotOptions(speciesName, slot) {
  return speciesIngredientSlots[speciesName]?.[slot] ?? []
}

export function getIngredientQuantity(speciesName, slot, ingredientName) {
  if (!ingredientName) return null
  return getIngredientSlotOptions(speciesName, slot).find((opt) => opt.name === ingredientName)?.quantity ?? null
}
