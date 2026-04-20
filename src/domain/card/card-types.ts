export interface CardFace {
  name: string;
  imageUris?: Record<string, string>;
}

export interface SetSummary {
  code: string;
  name: string;
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
  /** Imagen de la segunda cara para DFCs (transform, modal_dfc, etc.). `null` si no aplica. */
  backImageUrl: string | null;
}
