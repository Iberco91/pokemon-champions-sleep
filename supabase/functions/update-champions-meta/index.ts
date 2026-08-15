// Meta Tracker de Pokémon Champions (Fase 9 — CLAUDE.md sección 2.2),
// mecanismo manual/on-demand: el usuario dispara esta función desde
// MetaPanel.jsx ("Actualizar Meta ahora"), NO corre en un cron todavía.
//
// Hace scraping real (server-side, no LLM) de https://champdex.com/meta —
// un sitio público de estadísticas de uso en vivo de Pokémon Champions — y
// reemplaza el contenido de champions_meta_cache por el snapshot actual.
//
// Estructura verificada manualmente contra el HTML real de la página el
// 2026-08-03: cada Pokémon del ranking es un <a class="group block"
// href="/dex/{slug}"> que contiene el nombre (atributo alt del sprite), 1-2
// badges de tipo abreviados a 3 letras, el % de uso global, su movimiento
// más común con % de uso propio, y su objeto más común ("w/ {item}"). Si
// champdex.com rediseña la página, esta función deja de encontrar tarjetas
// y responde matchedCount: 0 sin tocar la tabla — revisar el regex acá.
//
// Despliegue manual (no se hace automáticamente):
//   supabase functions deploy update-champions-meta
// Requiere que el proyecto Supabase tenga seteadas las env vars
// SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (Supabase las inyecta solas en
// Edge Functions), y se invoca desde el cliente con supabase.functions.invoke.

import { createClient } from 'jsr:@supabase/supabase-js@2'

const META_SOURCE_URL = 'https://champdex.com/meta'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function parseMetaCards(html: string) {
  const cardRe = /<a class="group block" href="\/dex\/([a-z0-9-]+)">([\s\S]*?)<\/a>/g
  const entries: {
    rank_position: number
    pokemon_name: string
    common_moves: { move: string; usagePercentage: number }[]
    common_items: { item: string }[]
    usage_percentage: number
  }[] = []

  let match: RegExpExecArray | null
  let rank = 0
  while ((match = cardRe.exec(html))) {
    const block = match[2]
    // Solo las tarjetas del ranking principal traen el % de uso global con
    // esta clase; el widget de "trending" reusa el mismo <a class="group
    // block"> pero sin este bloque, así que se descarta.
    if (!block.includes('text-right text-[15px] tabular-nums')) continue

    const nameMatch = block.match(/alt="([^"]+)"/)
    const usageMatch = block.match(/color:#FBFF42;-webkit-text-stroke:0\.3px #0F1850">([0-9.]+)%<\/span>/)
    const moveMatch = block.match(
      /class="truncate">([^<]+)<!-- --> <span class="tabular-nums text-white\/65">([0-9]+)<!-- -->%<\/span>/,
    )
    const itemMatch = block.match(/class="truncate">w\/ <!-- -->([^<]+)<\/span>/)

    if (!nameMatch || !usageMatch) continue

    rank += 1
    entries.push({
      rank_position: rank,
      pokemon_name: nameMatch[1],
      common_moves: moveMatch ? [{ move: moveMatch[1], usagePercentage: Number(moveMatch[2]) }] : [],
      common_items: itemMatch ? [{ item: itemMatch[1] }] : [],
      usage_percentage: Number(usageMatch[1]),
    })
  }
  return entries
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const response = await fetch(META_SOURCE_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PokemonChampionsSleepToolkit/1.0)' },
    })
    if (!response.ok) {
      throw new Error(`No se pudo obtener ${META_SOURCE_URL} (HTTP ${response.status})`)
    }
    const html = await response.text()
    const entries = parseMetaCards(html)

    if (entries.length === 0) {
      return new Response(
        JSON.stringify({ ok: false, matchedCount: 0, message: 'No se encontraron tarjetas del meta — revisar el parser.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // champions_meta_cache representa el snapshot ACTUAL, no un historial:
    // se reemplaza por completo en cada actualización manual.
    const { error: deleteError } = await supabase.from('champions_meta_cache').delete().gte('id', 0)
    if (deleteError) throw deleteError

    const { error: insertError } = await supabase.from('champions_meta_cache').insert(entries)
    if (insertError) throw insertError

    return new Response(
      JSON.stringify({ ok: true, matchedCount: entries.length, updatedAt: new Date().toISOString() }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, message: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
