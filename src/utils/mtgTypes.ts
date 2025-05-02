
export interface Card {
  id: string;
  name: string;
  imageUrl?: string;
  manaCost?: string;
  cmc?: number;
  colors?: string[];
  type?: string;
  rarity?: string;
  text?: string;
  power?: string;
  toughness?: string;
  set?: string;
  setName?: string;
}

export interface Deck {
  id: string;
  name: string;
  format: string;
  cards: { [cardId: string]: number }; // cardId to quantity mapping
  colors: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GameState {
  playerHand: Card[];
  playerBoard: Card[];
  opponentBoard: Card[];
  playerLife: number;
  opponentLife: number;
  turn: number;
  priority: 'player' | 'opponent';
  phase: GamePhase;
  playerMana: ManaPool;
}

export interface ManaPool {
  white: number;
  blue: number;
  black: number;
  red: number;
  green: number;
  colorless: number;
}

export interface AIAdvice {
  recommendedPlay: string;
  reasoning: string;
  alternativePlays?: string[];
  predictedOpponentResponse?: string;
  confidenceScore?: number;
}

export interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  averageGameLength: number;
  mostPlayedCard: string;
  mostEffectiveCard: string;
  deckPerformance: { [deckId: string]: DeckPerformance };
}

export interface DeckPerformance {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  averageTurnLength: number;
}

export type GamePhase = 
  | 'Untap'
  | 'Upkeep'
  | 'Draw'
  | 'Main1'
  | 'Combat'
  | 'Main2'
  | 'End';

export interface LogEntry {
  timestamp: string;
  type: string;
  data: any;
  raw: string;
}
