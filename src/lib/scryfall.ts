import { writeFile } from "fs/promises";
import { join } from "path";

const SCRYFALL_API_BASE = "https://api.scryfall.com";

export type BulkDataType =
  | "oracle_cards"
  | "unique_artwork"
  | "default_cards"
  | "all_cards"
  | "rulings";

export interface BulkDataItem {
  id: string;
  uri: string;
  type: BulkDataType;
  name: string;
  description: string;
  download_uri: string;
  updated_at: string;
  compressed_size: number;
  content_type: string;
  content_encoding: string;
}

export interface BulkDataResponse {
  object: "list";
  has_more: boolean;
  data: BulkDataItem[];
}

export async function getBulkData(): Promise<BulkDataResponse> {
  const response = await fetch(`${SCRYFALL_API_BASE}/bulk-data`);

  if (!response.ok) {
    throw new Error(`Scryfall API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<BulkDataResponse>;
}

export async function getBulkDataByType(type: BulkDataType): Promise<BulkDataItem> {
  const response = await fetch(`${SCRYFALL_API_BASE}/bulk-data/${type}`);

  if (!response.ok) {
    throw new Error(`Scryfall API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<BulkDataItem>;
}

export async function saveBulkDataToJson(
  type: BulkDataType,
  outputDir: string = "."
): Promise<string> {
  const data = await getBulkDataByType(type);
  const filePath = join(outputDir, `scryfall_${type}.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  return filePath;
}
