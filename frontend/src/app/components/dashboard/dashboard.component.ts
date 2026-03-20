import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatToolbarModule],
  template: `
    <mat-toolbar color="primary">
      <span>Mastermind Itaú</span>
      <span class="spacer"></span>
      <span class="welcome-text">Olá, {{ username }}</span>
      <button mat-icon-button (click)="logout()" title="Sair">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <div class="container">
      <h2 class="mt-3">Dashboard</h2>
      
      <div class="cards-grid">
        <mat-card class="dashboard-card action-card new-game" (click)="startNewGame()">
          <mat-card-header>
            <mat-icon mat-card-avatar>play_circle_filled</mat-icon>
            <mat-card-title>Nova Partida</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Inicie um novo desafio de adivinhação do código secreto.</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card action-card ranking" (click)="goToRanking()">
          <mat-card-header>
            <mat-icon mat-card-avatar>leaderboard</mat-icon>
            <mat-card-title>Ranking Global</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Veja os melhores jogadores de todos os tempos.</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .welcome-text { margin-right: 16px; font-size: 14px; }
    .container { padding: 24px; max-width: 1200px; margin: 0 auto; }
    
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-top: 24px;
    }

    .dashboard-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .dashboard-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    .dashboard-card mat-icon {
      font-size: 32px;
      height: 32px;
      width: 32px;
      color: var(--primary);
    }
    
    mat-toolbar {
      background-color: var(--primary);
      color: white;
    }
  `]
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private gameService = inject(GameService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  username = this.authService.currentUserValue?.username || '';

  logout() {
    this.authService.logout();
  }

  startNewGame() {
  this.gameService.createGame().subscribe({
    next: (res) => {
      this.router.navigate(['/game', res.game_id]);
    },
    error: (err) => {
      this.toastr.error('Erro ao criar nova partida. Tente novamente.', 'Erro');
    }
  });
}

  goToRanking() {
    this.router.navigate(['/ranking']);
  }
}
