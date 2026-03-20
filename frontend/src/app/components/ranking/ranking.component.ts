import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
import { RankingEntry } from '../../models/game.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatToolbarModule],
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <span>Ranking Global - Mastermind</span>
    </mat-toolbar>

    <div class="container">
      <mat-card class="ranking-card">
        <mat-card-header>
          <mat-card-title>Melhores Jogadores</mat-card-title>
          <mat-card-subtitle>Menos tentativas primeiro, e depois menor tempo geram melhores posições.</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <table mat-table [dataSource]="rankingData" class="mat-elevation-z1">
            
            <!-- Position Column -->
            <ng-container matColumnDef="position">
              <th mat-header-cell *matHeaderCellDef> Pos. </th>
              <td mat-cell *matCellDef="let element">
                <span class="pos-badge" [ngClass]="{'top-1': element.position === 1, 'top-2': element.position === 2, 'top-3': element.position === 3}">
                  {{ element.position }}º
                </span>
              </td>
            </ng-container>

            <!-- Username Column -->
            <ng-container matColumnDef="username">
              <th mat-header-cell *matHeaderCellDef> Jogador </th>
              <td mat-cell *matCellDef="let element"> 
                <b>{{ element.username }}</b> 
                <span class="current-user-lbl" *ngIf="element.username === currentUsername">(Você)</span>
              </td>
            </ng-container>

            <!-- Attempts Column -->
            <ng-container matColumnDef="attempts">
              <th mat-header-cell *matHeaderCellDef> Tentativas </th>
              <td mat-cell *matCellDef="let element"> {{ element.attempts }} </td>
            </ng-container>

            <!-- Duration Column -->
            <ng-container matColumnDef="duration_seconds">
              <th mat-header-cell *matHeaderCellDef> Tempo (s) </th>
              <td mat-cell *matCellDef="let element"> {{ element.duration_seconds }}s </td>
            </ng-container>

            <!-- Date Column -->
            <ng-container matColumnDef="finished_at">
              <th mat-header-cell *matHeaderCellDef> Data </th>
              <td mat-cell *matCellDef="let element"> {{ element.finished_at | date:'dd/MM/yyyy HH:mm' }} </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" [ngClass]="{'highlight-row': row.username === currentUsername}"></tr>
          </table>
          <div *ngIf="rankingData.length === 0" class="no-data">Nenhum jogador venceu ainda.</div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 24px; max-width: 1000px; margin: 0 auto; }
    mat-toolbar { background-color: var(--primary); color: white; }
    table { width: 100%; margin-top: 16px; border-radius: 8px; overflow: hidden; }
    
    .pos-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      background-color: #e0e0e0;
      color: #333;
      font-weight: bold;
    }
    .top-1 { background-color: #ffd700; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
    .top-2 { background-color: #c0c0c0; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
    .top-3 { background-color: #cd7f32; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }

    .current-user-lbl {
      color: var(--primary);
      font-size: 12px;
      margin-left: 8px;
    }

    .highlight-row { background-color: #fff8eb; }

    .no-data { padding: 32px; text-align: center; color: var(--text-secondary); }
  `]
})
export class RankingComponent implements OnInit {
  private gameService = inject(GameService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  displayedColumns: string[] = ['position', 'username', 'attempts', 'duration_seconds', 'finished_at'];
  rankingData: RankingEntry[] = [];
  currentUsername = this.authService.currentUserValue?.username;

  ngOnInit() {
  this.gameService.getRanking().subscribe({
    next: (data) => this.rankingData = data,
    error: (err) => this.toastr.error('Erro ao carregar ranking', 'Erro')
  });
}

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
