export interface CardFace {
  name: string;
  imageUris?: Record<string, string>;
}

export interface CardSummary {
  id: string;
  name: string;
  typeLine: string;
  manaCost: string | null;
  rarity: string;
  set: string;
  setName: string;
  colors: string[];
  colorIdentity: string[];
  imageUrl: string | null;
}
