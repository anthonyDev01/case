import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameState, RankingEntry } from '../models/game.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  createGame(): Observable<{ game_id: number; max_attempts: number }> {
    return this.http.post<{ game_id: number; max_attempts: number }>(`${this.apiUrl}/games`, {});
  }

  getGame(gameId: number): Observable<GameState> {
    return this.http.get<GameState>(`${this.apiUrl}/games/${gameId}`);
  }

  makeAttempt(gameId: number, digits: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/games/${gameId}/attempt`, { digits });
  }

  getRanking(): Observable<RankingEntry[]> {
    return this.http.get<RankingEntry[]>(`${this.apiUrl}/ranking`);
  }
}
