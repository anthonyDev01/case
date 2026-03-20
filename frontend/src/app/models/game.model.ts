export interface Attempt {
  attempt_number: number;
  digits: number[];
  correct_positions: number;
  wrong_positions: number;
}

export interface GameState {
  game_id: number;
  status: 'ongoing' | 'won' | 'lost';
  attempts: Attempt[];
  attempts_left: number;
  secret_code?: number[];
  max_attempts?: number;
}

export interface RankingEntry {
  position: number;
  username: string;
  attempts: number;
  duration_seconds: number;
  finished_at: string;
}
