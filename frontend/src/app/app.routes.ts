import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'game/:id', 
    loadComponent: () => import('./components/game/game.component').then(m => m.GameComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'ranking', 
    loadComponent: () => import('./components/ranking/ranking.component').then(m => m.RankingComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'dashboard' }
];