import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GameState, Attempt } from '../../models/game.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, 
    MatIconModule, MatToolbarModule, MatProgressSpinnerModule, MatDialogModule
  ],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span>Partida #{{ gameId }}</span>
    </mat-toolbar>

    <div class="container" *ngIf="gameState; else loading">
      
      <div class="game-board">
        <div class="board-header">
          <h3>Tentativas restantes: {{ gameState.attempts_left }}</h3>
          <span class="status-badge" [ngClass]="gameState.status">
            {{ gameState.status === 'ongoing' ? 'Em andamento' : (gameState.status === 'won' ? 'Vitória' : 'Derrota') }}
          </span>
        </div>

        <!-- Histórico de tentativas -->
        <div class="attempts-history">
          <div *ngFor="let attempt of gameState.attempts" class="attempt-row past-attempt">
            <div class="attempt-number">{{ attempt.attempt_number }}</div>
            <div class="pins-container">
              <div *ngFor="let digit of attempt.digits" class="pin guess-pin">{{ digit }}</div>
            </div>
            <div class="feedback-container">
              <div *ngFor="let _ of getArray(attempt.correct_positions)" class="feedback-pin correct" title="Posição correta"></div>
              <div *ngFor="let _ of getArray(attempt.wrong_positions)" class="feedback-pin wrong" title="Dígito correto, posição errada"></div>
              <div *ngFor="let _ of getArray(4 - attempt.correct_positions - attempt.wrong_positions)" class="feedback-pin empty"></div>
            </div>
          </div>
        </div>

        <!-- Linha da tentativa ativa -->
        <mat-card class="active-attempt-card" *ngIf="gameState.status === 'ongoing'">
          <form [formGroup]="attemptForm" (ngSubmit)="submitAttempt()">
            <div class="attempt-row active-attempt">
              <div class="attempt-number">▶</div>
              <div class="pins-container" formArrayName="digits">
                <input 
                  *ngFor="let control of digits.controls; let i=index" 
                  type="number" 
                  min="1" 
                  max="6" 
                  [formControlName]="i" 
                  class="pin-input"
                  (keyup)="autoFocusNext($event, i)"
                  id="pin-input-{{i}}"
                />
              </div>
              <div class="action-container">
                <button mat-flat-button color="primary" type="submit" [disabled]="attemptForm.invalid || isSubmitting">
                  {{ isSubmitting ? 'Enviando...' : 'Confirmar' }}
                </button>
              </div>
            </div>
          </form>
        </mat-card>

        <mat-card class="result-card" *ngIf="gameState.status !== 'ongoing'">
          <mat-card-header>
            <mat-card-title>
              {{ gameState.status === 'won' ? 'Parabéns, você venceu!' : 'Fim de jogo!' }}
            </mat-card-title>
          </mat-card-header>
          <mat-card-content *ngIf="gameState.secret_code">
            <p>O código secreto era:</p>
            <div class="pins-container result-secret">
              <div *ngFor="let digit of gameState.secret_code" class="pin guess-pin secret-pin">{{ digit }}</div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="goBack()">Voltar ao Dashboard</button>
          </mat-card-actions>
        </mat-card>

      </div>
    </div>

    <ng-template #loading>
      <div class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Carregando tabuleiro...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .container { padding: 24px; max-width: 800px; margin: 0 auto; }
    mat-toolbar { background-color: var(--primary); color: white; }
    
    .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh; }
    
    .game-board {
      background: var(--surface);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      padding: 24px;
      margin-top: 16px;
    }

    .board-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
    }
    .status-badge.ongoing { background-color: #e3f2fd; color: #1976d2; }
    .status-badge.won { background-color: #e8f5e9; color: #2e7d32; }
    .status-badge.lost { background-color: #ffebee; color: #c62828; }

    .attempt-row {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      padding: 12px;
      border-radius: 8px;
      background-color: #fafafa;
    }

    .attempt-number {
      width: 40px;
      font-weight: bold;
      color: var(--text-secondary);
      text-align: center;
    }

    .pins-container {
      display: flex;
      gap: 12px;
      margin: 0 24px;
    }

    .pin {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .guess-pin {
      background-color: var(--primary);
    }
    
    .secret-pin {
      background-color: #333;
    }

    .feedback-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px;
    }

    .feedback-pin {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1px solid var(--border);
    }

    .feedback-pin.correct { background-color: var(--primary); border-color: var(--primary); }
    .feedback-pin.wrong { background-color: #bdbdbd; border-color: #bdbdbd; }
    .feedback-pin.empty { background-color: transparent; }

    .pin-input {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px solid var(--primary);
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: var(--text-primary);
      outline: none;
      transition: border-color 0.2s;
      -webkit-appearance: none;
      -moz-appearance: textfield;
    }
    .pin-input::-webkit-outer-spin-button,
    .pin-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    .pin-input:focus { border-color: var(--primary-hover); box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.2); }

    .active-attempt-card {
      margin-top: 24px;
      background-color: #fff3e0;
      border: 1px solid #ffe0b2;
    }
    
    .result-card {
      margin-top: 24px;
      background-color: #f5f5f5;
    }
    .result-secret { padding: 16px 0; }
  `]
})
export class GameComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gameService = inject(GameService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  gameId!: number;
  gameState: GameState | null = null;
  isSubmitting = false;

  attemptForm: FormGroup = this.fb.group({
    digits: this.fb.array([
      this.fb.control(null, [Validators.required, Validators.min(1), Validators.max(6)]),
      this.fb.control(null, [Validators.required, Validators.min(1), Validators.max(6)]),
      this.fb.control(null, [Validators.required, Validators.min(1), Validators.max(6)]),
      this.fb.control(null, [Validators.required, Validators.min(1), Validators.max(6)])
    ])
  });

  get digits(): FormArray {
    return this.attemptForm.get('digits') as FormArray;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.gameId = +id;
        this.loadGame();
      }
    });
  }

  loadGame() {
    this.gameService.getGame(this.gameId).subscribe({
      next: (state) => {
        this.gameState = state;
      },
      error: (err) => {
        console.error('Failed to load game', err);
        this.router.navigate(['/dashboard']);
      }
    });
  }

  autoFocusNext(event: any, index: number) {
    const val = event.target.value;
    if (val && val >= 1 && val <= 6 && index < 3) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      nextInput?.focus();
    }
  }

  submitAttempt() {
    if (this.attemptForm.valid && this.gameState) {
      this.isSubmitting = true;
      const values = this.attemptForm.value.digits;
      
      this.gameService.makeAttempt(this.gameId, values).subscribe({
        next: (result) => {
          this.isSubmitting = false;
          if (result.status === 'won') {
            this.toastr.success(`Você venceu em ${result.attempt_number} tentativas! 🎉`);
          } else if (result.status === 'lost') {
            this.toastr.error('Fim de jogo! Você usou todas as tentativas.');
          }
          this.loadGame();
          this.attemptForm.reset();
          document.getElementById('pin-input-0')?.focus();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toastr.error(err?.message || 'Erro ao enviar tentativa', 'Erro');
        }
      });
    }
  }

  getArray(length: number): any[] {
    return new Array(length);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
