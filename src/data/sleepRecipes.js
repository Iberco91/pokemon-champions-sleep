// Datos reales de ingredientes/recetas de Pokémon Sleep (Fase 6 — CLAUDE.md
// sección 1.4). Fuente: código fuente de dos calculadoras open-source
// independientes que coinciden en todos los valores (nerolis-lab/nerolis-lab
// — common/src/types/ingredient/ingredients.ts y common/src/types/recipe/* —
// y nitoyon/pokesleep-tool). Reemplaza al `dishRecipes` placeholder que tenía
// valores inventados.

// Valor base de cada ingrediente (usado solo como insumo de recetas, no se le
// da directamente a Snorlax como a las berries).
export const ingredientValues = {
  'Fancy Apple': 90,
  'Moomoo Milk': 98,
  'Greengrass Soybeans': 100,
  Honey: 101,
  'Bean Sausage': 103,
  'Warming Ginger': 109,
  'Snoozy Tomato': 110,
  'Fancy Egg': 115,
  'Pure Oil': 121,
  'Soft Potato': 124,
  'Fiery Herb': 130,
  'Greengrass Corn': 140,
  'Soothing Cacao': 151,
  'Rousing Coffee': 153,
  'Glossy Avocado': 162,
  'Tasty Mushroom': 167,
  'Large Leek': 185,
  'Plump Pumpkin': 250,
  'Slowpoke Tail': 342,
}

// Bonus promedio semanal de "Extra Tasty": 10% de probabilidad de x2 entre
// semana + 30% de probabilidad de x3 el domingo, promediado en los 7 días.
// ((6*(0.9*1+0.1*2)) + (1*(0.7*1+0.3*3))) / 7 = 1.171428571...
export const AVERAGE_WEEKLY_CRIT_MULTIPLIER = 1.171428571

// Multiplicador del valor de una receta según el nivel de receta del
// jugador (1-70, distinto del nivel del Pokémon; sube cocinando). Dato que
// solo el jugador conoce — no hay forma de derivarlo, se pide como input.
export const recipeLevelBonusTable = [
  null, // índice 0 sin usar, los niveles son 1-70
  1, 1.02, 1.04, 1.06, 1.08, 1.09, 1.11, 1.13, 1.16, 1.18,
  1.19, 1.21, 1.23, 1.24, 1.26, 1.28, 1.3, 1.31, 1.33, 1.35,
  1.37, 1.4, 1.42, 1.45, 1.47, 1.5, 1.52, 1.55, 1.58, 1.61,
  1.64, 1.67, 1.7, 1.74, 1.77, 1.81, 1.84, 1.88, 1.92, 1.96,
  2, 2.04, 2.08, 2.13, 2.17, 2.22, 2.27, 2.32, 2.37, 2.42,
  2.48, 2.53, 2.59, 2.65, 2.71, 2.77, 2.83, 2.9, 2.97, 3.03,
  3.09, 3.15, 3.21, 3.27, 3.34, 3.39, 3.43, 3.48, 3.52, 3.58,
]

export const MAX_RECIPE_LEVEL = 70

function ing(name, amount) {
  return { name, amount }
}

// 81 recetas reales: 25 Curry + 26 Ensaladas + 27 Postres + 3 "mixed" (la
// receta gratis de 0 ingredientes que siempre se puede cocinar). `bonus` es
// un % fijo por receta (no aleatorio) que se suma al valor base.
export const recipes = [
  // Curry
  { name: 'Fancy Apple Curry', type: 'Curry', ingredients: [ing('Fancy Apple', 7)], bonus: 18.7 },
  { name: 'Simple Chowder', type: 'Curry', ingredients: [ing('Moomoo Milk', 7)], bonus: 18.7 },
  { name: 'Mild Honey Curry', type: 'Curry', ingredients: [ing('Honey', 7)], bonus: 18.7 },
  { name: 'Beanburger Curry', type: 'Curry', ingredients: [ing('Bean Sausage', 7)], bonus: 18.7 },
  {
    name: 'Hearty Cheeseburger Curry',
    type: 'Curry',
    ingredients: [ing('Moomoo Milk', 8), ing('Bean Sausage', 8)],
    bonus: 18.77,
  },
  {
    name: '"Drought" Katsu Curry',
    type: 'Curry',
    ingredients: [ing('Bean Sausage', 10), ing('Pure Oil', 5)],
    bonus: 18.77,
  },
  {
    name: '"Solar Power" Tomato Curry',
    type: 'Curry',
    ingredients: [ing('Snoozy Tomato', 10), ing('Fiery Herb', 5)],
    bonus: 18.77,
  },
  {
    name: 'Melty Omelette Curry',
    type: 'Curry',
    ingredients: [ing('Fancy Egg', 10), ing('Snoozy Tomato', 6)],
    bonus: 18.77,
  },
  {
    name: 'Soft Potato Chowder',
    type: 'Curry',
    ingredients: [ing('Moomoo Milk', 10), ing('Soft Potato', 8), ing('Tasty Mushroom', 4)],
    bonus: 20.51,
  },
  {
    name: '"Bulk Up" Bean Curry',
    type: 'Curry',
    ingredients: [ing('Greengrass Soybeans', 12), ing('Bean Sausage', 6), ing('Fiery Herb', 4), ing('Fancy Egg', 4)],
    bonus: 20.51,
  },
  {
    name: '"Spore" Mushroom Curry',
    type: 'Curry',
    ingredients: [ing('Tasty Mushroom', 14), ing('Soft Potato', 9)],
    bonus: 20.51,
  },
  {
    name: '"Egg Bomb" Curry',
    type: 'Curry',
    ingredients: [ing('Honey', 12), ing('Fancy Apple', 11), ing('Fancy Egg', 8), ing('Soft Potato', 4)],
    bonus: 25,
  },
  {
    name: '"Limber" Corn Stew',
    type: 'Curry',
    ingredients: [ing('Greengrass Corn', 14), ing('Moomoo Milk', 8), ing('Soft Potato', 8)],
    bonus: 25,
  },
  {
    name: '"Dizzy Punch" Spicy Curry',
    type: 'Curry',
    ingredients: [ing('Rousing Coffee', 11), ing('Fiery Herb', 11), ing('Honey', 11)],
    bonus: 35,
  },
  {
    name: 'Spicy Leek Curry',
    type: 'Curry',
    ingredients: [ing('Large Leek', 14), ing('Warming Ginger', 10), ing('Fiery Herb', 8)],
    bonus: 25,
  },
  {
    name: 'Ninja Curry',
    type: 'Curry',
    ingredients: [
      ing('Greengrass Soybeans', 24),
      ing('Bean Sausage', 9),
      ing('Large Leek', 12),
      ing('Tasty Mushroom', 5),
    ],
    bonus: 48,
  },
  {
    name: 'Grilled Tail Curry',
    type: 'Curry',
    ingredients: [ing('Slowpoke Tail', 8), ing('Fiery Herb', 25)],
    bonus: 25,
  },
  {
    name: '"Dream Eater" Butter Curry',
    type: 'Curry',
    ingredients: [ing('Soft Potato', 18), ing('Snoozy Tomato', 15), ing('Soothing Cacao', 12), ing('Moomoo Milk', 10)],
    bonus: 35,
  },
  {
    name: '"Inferno" Corn Keema Curry',
    type: 'Curry',
    ingredients: [
      ing('Fiery Herb', 27),
      ing('Bean Sausage', 24),
      ing('Greengrass Corn', 14),
      ing('Warming Ginger', 12),
    ],
    bonus: 48,
  },
  {
    name: '"Hidden Power" Perk-Up Stew',
    type: 'Curry',
    ingredients: [
      ing('Greengrass Soybeans', 28),
      ing('Snoozy Tomato', 25),
      ing('Tasty Mushroom', 23),
      ing('Rousing Coffee', 16),
    ],
    bonus: 61,
  },
  {
    name: '"Cut" Sukiyaki Curry',
    type: 'Curry',
    ingredients: [ing('Large Leek', 27), ing('Bean Sausage', 26), ing('Honey', 26), ing('Fancy Egg', 22)],
    bonus: 61,
  },
  {
    name: '"Role Play" Pumpkaboo Stew',
    type: 'Curry',
    ingredients: [ing('Plump Pumpkin', 10), ing('Bean Sausage', 16), ing('Soft Potato', 18), ing('Tasty Mushroom', 25)],
    bonus: 48,
  },
  {
    name: '"Overgrow" Avocado Gratin',
    type: 'Curry',
    ingredients: [ing('Glossy Avocado', 22), ing('Soft Potato', 20), ing('Moomoo Milk', 41), ing('Pure Oil', 32)],
    bonus: 78,
  },
  {
    name: 'Greengrass Curry Bun',
    type: 'Curry',
    ingredients: [
      ing('Warming Ginger', 20),
      ing('Fiery Herb', 20),
      ing('Greengrass Soybeans', 8),
      ing('Pure Oil', 15),
    ],
    bonus: 48,
  },
  {
    name: '"Bounce" Curry Udon',
    type: 'Curry',
    ingredients: [
      ing('Warming Ginger', 39),
      ing('Tasty Mushroom', 31),
      ing('Fiery Herb', 22),
      ing('Bean Sausage', 20),
    ],
    bonus: 78,
  },
  { name: 'Mixed Curry', type: 'Curry', ingredients: [], bonus: 0 },

  // Ensaladas
  { name: 'Fancy Apple Salad', type: 'Ensaladas', ingredients: [ing('Fancy Apple', 8)], bonus: 18.7 },
  { name: 'Bean Ham Salad', type: 'Ensaladas', ingredients: [ing('Bean Sausage', 8)], bonus: 18.7 },
  { name: 'Snoozy Tomato Salad', type: 'Ensaladas', ingredients: [ing('Snoozy Tomato', 8)], bonus: 18.7 },
  {
    name: '"Snow Cloak" Caesar Salad',
    type: 'Ensaladas',
    ingredients: [ing('Moomoo Milk', 10), ing('Bean Sausage', 6)],
    bonus: 18.77,
  },
  {
    name: '"Water Veil" Tofu Salad',
    type: 'Ensaladas',
    ingredients: [ing('Greengrass Soybeans', 15), ing('Snoozy Tomato', 9)],
    bonus: 25,
  },
  {
    name: '"Heat Wave" Tofu Salad',
    type: 'Ensaladas',
    ingredients: [ing('Greengrass Soybeans', 10), ing('Fiery Herb', 6)],
    bonus: 18.77,
  },
  {
    name: '"Dazzling" Apple Cheese Salad',
    type: 'Ensaladas',
    ingredients: [ing('Fancy Apple', 15), ing('Moomoo Milk', 5), ing('Pure Oil', 3)],
    bonus: 20.51,
  },
  {
    name: '"Fury Attack" Corn Salad',
    type: 'Ensaladas',
    ingredients: [ing('Greengrass Corn', 9), ing('Pure Oil', 8)],
    bonus: 25,
  },
  {
    name: 'Moomoo Caprese Salad',
    type: 'Ensaladas',
    ingredients: [ing('Moomoo Milk', 12), ing('Snoozy Tomato', 6), ing('Pure Oil', 5)],
    bonus: 20.51,
  },
  {
    name: '"Immunity" Leek Salad',
    type: 'Ensaladas',
    ingredients: [ing('Large Leek', 10), ing('Warming Ginger', 5)],
    bonus: 18.77,
  },
  {
    name: '"Superpower" Extreme Salad',
    type: 'Ensaladas',
    ingredients: [ing('Bean Sausage', 9), ing('Warming Ginger', 6), ing('Fancy Egg', 5), ing('Soft Potato', 3)],
    bonus: 20.51,
  },
  {
    name: '"Contrary" Chocolate Meat Salad',
    type: 'Ensaladas',
    ingredients: [ing('Soothing Cacao', 14), ing('Bean Sausage', 9)],
    bonus: 20.51,
  },
  {
    name: '"Gluttony" Potato Salad',
    type: 'Ensaladas',
    ingredients: [ing('Soft Potato', 14), ing('Fancy Egg', 9), ing('Bean Sausage', 7), ing('Fancy Apple', 6)],
    bonus: 25,
  },
  {
    name: '"Overheat" Ginger Salad',
    type: 'Ensaladas',
    ingredients: [ing('Fiery Herb', 17), ing('Warming Ginger', 10), ing('Snoozy Tomato', 8)],
    bonus: 25,
  },
  {
    name: '"Spore" Mushroom Salad',
    type: 'Ensaladas',
    ingredients: [ing('Tasty Mushroom', 17), ing('Snoozy Tomato', 8), ing('Pure Oil', 8)],
    bonus: 25,
  },
  {
    name: '"Calm Mind" Fruit Salad',
    type: 'Ensaladas',
    ingredients: [ing('Fancy Apple', 21), ing('Honey', 16), ing('Greengrass Corn', 12)],
    bonus: 48,
  },
  {
    name: 'Slowpoke Tail Pepper Salad',
    type: 'Ensaladas',
    ingredients: [ing('Slowpoke Tail', 10), ing('Fiery Herb', 10), ing('Pure Oil', 15)],
    bonus: 25,
  },
  {
    name: '"Cross Chop" Salad',
    type: 'Ensaladas',
    ingredients: [ing('Fancy Egg', 20), ing('Bean Sausage', 15), ing('Greengrass Corn', 11), ing('Snoozy Tomato', 10)],
    bonus: 35,
  },
  {
    name: 'Greengrass Salad',
    type: 'Ensaladas',
    ingredients: [ing('Pure Oil', 22), ing('Greengrass Corn', 17), ing('Snoozy Tomato', 14), ing('Soft Potato', 9)],
    bonus: 48,
  },
  {
    name: 'Ninja Salad',
    type: 'Ensaladas',
    ingredients: [
      ing('Large Leek', 15),
      ing('Greengrass Soybeans', 19),
      ing('Tasty Mushroom', 12),
      ing('Warming Ginger', 11),
    ],
    bonus: 48,
  },
  {
    name: '"Petal Blizzard" Layered Salad',
    type: 'Ensaladas',
    ingredients: [ing('Fancy Egg', 25), ing('Pure Oil', 17), ing('Soft Potato', 15), ing('Bean Sausage', 12)],
    bonus: 48,
  },
  {
    name: '"Apple Acid" Yogurt-Dressed Salad',
    type: 'Ensaladas',
    ingredients: [ing('Fancy Egg', 35), ing('Fancy Apple', 28), ing('Snoozy Tomato', 23), ing('Moomoo Milk', 18)],
    bonus: 78,
  },
  {
    name: '"Defiant" Coffee-Dressed Salad',
    type: 'Ensaladas',
    ingredients: [ing('Rousing Coffee', 28), ing('Bean Sausage', 28), ing('Pure Oil', 22), ing('Soft Potato', 22)],
    bonus: 61,
  },
  {
    name: 'Luscious Avocado Salad',
    type: 'Ensaladas',
    ingredients: [ing('Glossy Avocado', 14), ing('Greengrass Soybeans', 18), ing('Pure Oil', 10)],
    bonus: 35,
  },
  {
    name: '"Bulldoze" Guacamole and Chips',
    type: 'Ensaladas',
    ingredients: [
      ing('Glossy Avocado', 28),
      ing('Greengrass Corn', 25),
      ing('Fiery Herb', 30),
      ing('Greengrass Soybeans', 22),
    ],
    bonus: 78,
  },
  {
    name: '"Scald" Chunky Salad',
    type: 'Ensaladas',
    ingredients: [ing('Plump Pumpkin', 20), ing('Soft Potato', 30), ing('Greengrass Corn', 18), ing('Tasty Mushroom', 27)],
    bonus: 61,
  },
  { name: 'Mixed Salad', type: 'Ensaladas', ingredients: [], bonus: 0 },

  // Postres
  { name: 'Warm Moomoo Milk', type: 'Postres', ingredients: [ing('Moomoo Milk', 7)], bonus: 18.7 },
  { name: 'Fancy Apple Juice', type: 'Postres', ingredients: [ing('Fancy Apple', 8)], bonus: 18.7 },
  { name: 'Craft Soda Pop', type: 'Postres', ingredients: [ing('Honey', 9)], bonus: 18.7 },
  {
    name: '"Lucky Chant" Apple Pie',
    type: 'Postres',
    ingredients: [ing('Fancy Apple', 12), ing('Moomoo Milk', 4)],
    bonus: 18.77,
  },
  {
    name: '"Fluffy" Sweet Potatoes',
    type: 'Postres',
    ingredients: [ing('Soft Potato', 9), ing('Moomoo Milk', 5)],
    bonus: 18.77,
  },
  {
    name: '"Ember" Ginger Tea',
    type: 'Postres',
    ingredients: [ing('Warming Ginger', 9), ing('Fancy Apple', 7)],
    bonus: 18.77,
  },
  {
    name: '"Cloud Nine" Soy Cake',
    type: 'Postres',
    ingredients: [ing('Fancy Egg', 8), ing('Greengrass Soybeans', 7)],
    bonus: 18.77,
  },
  {
    name: '"Stalwart" Vegetable Juice',
    type: 'Postres',
    ingredients: [ing('Snoozy Tomato', 9), ing('Fancy Apple', 7)],
    bonus: 18.77,
  },
  {
    name: 'Big Malasada',
    type: 'Postres',
    ingredients: [ing('Pure Oil', 10), ing('Moomoo Milk', 7), ing('Honey', 6)],
    bonus: 20.51,
  },
  {
    name: '"Hustle" Protein Smoothie',
    type: 'Postres',
    ingredients: [ing('Greengrass Soybeans', 15), ing('Soothing Cacao', 8)],
    bonus: 20.51,
  },
  {
    name: '"Huge Power" Soy Donuts',
    type: 'Postres',
    ingredients: [ing('Pure Oil', 12), ing('Greengrass Soybeans', 16), ing('Soothing Cacao', 7)],
    bonus: 35,
  },
  {
    name: '"Sweet Scent" Chocolate Cake',
    type: 'Postres',
    ingredients: [ing('Honey', 9), ing('Soothing Cacao', 8), ing('Moomoo Milk', 7)],
    bonus: 20.51,
  },
  {
    name: '"Petal Dance" Chocolate Tart',
    type: 'Postres',
    ingredients: [ing('Fancy Apple', 11), ing('Soothing Cacao', 11)],
    bonus: 25,
  },
  {
    name: '"Lovely Kiss" Smoothie',
    type: 'Postres',
    ingredients: [ing('Fancy Apple', 11), ing('Moomoo Milk', 9), ing('Honey', 7), ing('Soothing Cacao', 8)],
    bonus: 25,
  },
  {
    name: '"Steadfast" Ginger Cookies',
    type: 'Postres',
    ingredients: [ing('Honey', 14), ing('Warming Ginger', 12), ing('Soothing Cacao', 5), ing('Fancy Egg', 4)],
    bonus: 25,
  },
  {
    name: "Neroli's Restorative Tea",
    type: 'Postres',
    ingredients: [ing('Warming Ginger', 11), ing('Fancy Apple', 15), ing('Tasty Mushroom', 9)],
    bonus: 25,
  },
  {
    name: '"Explosion" Popcorn',
    type: 'Postres',
    ingredients: [ing('Greengrass Corn', 15), ing('Pure Oil', 14), ing('Moomoo Milk', 7)],
    bonus: 35,
  },
  {
    name: '"Early Bird" Coffee Jelly',
    type: 'Postres',
    ingredients: [ing('Rousing Coffee', 16), ing('Moomoo Milk', 14), ing('Honey', 12)],
    bonus: 35,
  },
  {
    name: '"Mold Breaker" Corn Tiramisu',
    type: 'Postres',
    ingredients: [ing('Rousing Coffee', 14), ing('Greengrass Corn', 14), ing('Moomoo Milk', 12)],
    bonus: 35,
  },
  {
    name: "Jigglypuff's Fruity Flan",
    type: 'Postres',
    ingredients: [ing('Honey', 20), ing('Fancy Egg', 15), ing('Moomoo Milk', 10), ing('Fancy Apple', 10)],
    bonus: 35,
  },
  {
    name: '"Teatime" Corn Scones',
    type: 'Postres',
    ingredients: [ing('Fancy Apple', 20), ing('Warming Ginger', 20), ing('Greengrass Corn', 18), ing('Moomoo Milk', 9)],
    bonus: 48,
  },
  {
    name: '"Flower Gift" Macarons',
    type: 'Postres',
    ingredients: [ing('Soothing Cacao', 25), ing('Fancy Egg', 25), ing('Honey', 17), ing('Moomoo Milk', 10)],
    bonus: 48,
  },
  {
    name: '"Zing Zap" Spiced Cola',
    type: 'Postres',
    ingredients: [ing('Fancy Apple', 35), ing('Warming Ginger', 20), ing('Large Leek', 20), ing('Rousing Coffee', 12)],
    bonus: 61,
  },
  {
    name: 'Clodsire Éclair',
    type: 'Postres',
    ingredients: [ing('Soothing Cacao', 30), ing('Moomoo Milk', 26), ing('Rousing Coffee', 24), ing('Honey', 22)],
    bonus: 61,
  },
  {
    name: '"Honey Gather" Chocolate Waffles',
    type: 'Postres',
    ingredients: [ing('Honey', 38), ing('Greengrass Corn', 28), ing('Pure Oil', 28), ing('Soothing Cacao', 21)],
    bonus: 78,
  },
  {
    name: '"Scary Face" Pancakes',
    type: 'Postres',
    ingredients: [ing('Plump Pumpkin', 18), ing('Fancy Egg', 24), ing('Honey', 32), ing('Snoozy Tomato', 29)],
    bonus: 78,
  },
  {
    name: '"Leaf Tornado" Smoothie',
    type: 'Postres',
    ingredients: [ing('Glossy Avocado', 18), ing('Snoozy Tomato', 16), ing('Moomoo Milk', 14)],
    bonus: 35,
  },
  { name: 'Mixed Juice', type: 'Postres', ingredients: [], bonus: 0 },
]

// Valor de una porción de una receta a un nivel de receta dado (1-70).
export function computeRecipeValue(recipe, recipeLevel) {
  const level = Math.min(MAX_RECIPE_LEVEL, Math.max(1, Math.round(recipeLevel) || 1))
  const baseValue = recipe.ingredients.reduce(
    (sum, item) => sum + item.amount * (ingredientValues[item.name] ?? 0),
    0,
  )
  return Math.round(baseValue * recipeLevelBonusTable[level] * (1 + recipe.bonus / 100))
}
