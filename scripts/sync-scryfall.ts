/**
 * sync-scryfall.ts
 *
 * Fetches oracle_cards bulk data directly from Scryfall API
 * and upserts all cards into the database. No intermediate files.
 *
 * Usage:
 *   npm run sync-scryfall
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";
import "dotenv/config";

const SCRYFALL_BULK_API = "https://api.scryfall.com/bulk-data";
const BATCH_SIZE = 500;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCard(c: any) {
  return {
    id: c.id,
    oracle_id: c.oracle_id ?? null,
    multiverse_ids: c.multiverse_ids ?? [],
    mtgo_id: c.mtgo_id ?? null,
    mtgo_foil_id: c.mtgo_foil_id ?? null,
    tcgplayer_id: c.tcgplayer_id ?? null,
    tcgplayer_etched_id: c.tcgplayer_etched_id ?? null,
    cardmarket_id: c.cardmarket_id ?? null,
    arena_id: c.arena_id ?? null,
    resource_id: c.resource_id ?? null,

    name: c.name,
    lang: c.lang,
    released_at: new Date(c.released_at),
    layout: c.layout,
    highres_image: c.highres_image,
    image_status: c.image_status,
    image_uris: c.image_uris ?? null,

    mana_cost: c.mana_cost ?? null,
    cmc: c.cmc,
    power: c.power ?? null,
    toughness: c.toughness ?? null,

    type_line: c.type_line,
    oracle_text: c.oracle_text ?? null,
    flavor_text: c.flavor_text ?? null,

    colors: c.colors ?? [],
    color_identity: c.color_identity ?? [],
    produced_mana: c.produced_mana ?? [],

    keywords: c.keywords ?? [],
    all_parts: c.all_parts ?? null,
    card_faces: c.card_faces ?? null,

    legalities: c.legalities,

    games: c.games ?? [],
    finishes: c.finishes ?? [],

    reserved: c.reserved,
    game_changer: c.game_changer ?? null,
    foil: c.foil,
    nonfoil: c.nonfoil,
    oversized: c.oversized,
    promo: c.promo,
    reprint: c.reprint,
    variation: c.variation,
    digital: c.digital,
    full_art: c.full_art,
    textless: c.textless,
    booster: c.booster,
    story_spotlight: c.story_spotlight,

    set_id: c.set_id,
    set: c.set,
    set_name: c.set_name,
    set_type: c.set_type,
    collector_number: c.collector_number,

    rarity: c.rarity,
    border_color: c.border_color,
    frame: c.frame,
    frame_effects: c.frame_effects ?? [],
    watermark: c.watermark ?? null,
    security_stamp: c.security_stamp ?? null,
    promo_types: c.promo_types ?? [],

    artist: c.artist ?? null,
    artist_ids: c.artist_ids ?? [],
    illustration_id: c.illustration_id ?? null,
    card_back_id: c.card_back_id ?? null,

    edhrec_rank: c.edhrec_rank ?? null,
    penny_rank: c.penny_rank ?? null,

    uri: c.uri,
    scryfall_uri: c.scryfall_uri,
    set_uri: c.set_uri,
    set_search_uri: c.set_search_uri,
    scryfall_set_uri: c.scryfall_set_uri,
    rulings_uri: c.rulings_uri,
    prints_search_uri: c.prints_search_uri,

    prices: c.prices,
    purchase_uris: c.purchase_uris ?? null,
    related_uris: c.related_uris,

    preview: c.preview ?? null,
  };
}

async function main() {
  // 1. Get bulk data manifest
  console.log("Fetching Scryfall bulk data manifest...");
  const manifestRes = await fetch(SCRYFALL_BULK_API);
  if (!manifestRes.ok) throw new Error(`Manifest error: ${manifestRes.status} ${manifestRes.statusText}`);
  const manifest = await manifestRes.json();

  const entry = manifest.data.find((d: { type: string }) => d.type === "oracle_cards");
  if (!entry) throw new Error("oracle_cards not found in Scryfall bulk data manifest");

  console.log(`Found: ${entry.name} — updated ${entry.updated_at}`);
  console.log(`Downloading from ${entry.download_uri} ...`);

  // 2. Stream-download and parse the full JSON
  const dataRes = await fetch(entry.download_uri);
  if (!dataRes.ok) throw new Error(`Download error: ${dataRes.status}`);

  const cards = await dataRes.json();
  if (!Array.isArray(cards)) throw new Error("Unexpected response format from Scryfall");

  console.log(`Downloaded ${cards.length} cards. Upserting in batches of ${BATCH_SIZE}...`);

  // 3. Upsert in batches
  let processed = 0;
  for (let i = 0; i < cards.length; i += BATCH_SIZE) {
    const batch = cards.slice(i, i + BATCH_SIZE).map(mapCard);

    await prisma.$transaction(
      batch.map((card) =>
        prisma.card.upsert({
          where: { id: card.id },
          create: card,
          update: card,
        })
      )
    );

    processed += batch.length;
    process.stdout.write(`\r  ${processed} / ${cards.length}`);
  }

  console.log(`\nDone. ${processed} cards synced to the database.`);
}

main()
  .catch((err) => {
    console.error("\nError:", err.message ?? err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
