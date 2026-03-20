import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="auth-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Acesso à Conta</mat-card-title>
          <mat-card-subtitle>Insira suas credenciais do Mastermind</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Usuário</mat-label>
              <input matInput formControlName="username" />
              <mat-error *ngIf="loginForm.get('username')?.hasError('required')">Usuário é obrigatório</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Senha</mat-label>
              <input matInput type="password" formControlName="password" />
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Senha é obrigatória</mat-error>
            </mat-form-field>

            <button mat-flat-button class="btn-primary full-width" type="submit" [disabled]="loginForm.invalid || isLoading">
              {{ isLoading ? 'Entrando...' : 'Entrar' }}
            </button>

            <div class="register-link">
              <span>Não tem uma conta?</span>
              <a routerLink="/register" class="link-register">Criar conta</a>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 16px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    mat-card-header {
      margin-bottom: 24px;
      justify-content: center;
      text-align: center;
    }
    mat-card-title {
      font-size: 24px;
      color: var(--primary);
      font-weight: 500;
    }
    .register-link {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      font-size: 14px;
      color: #666;
    }
    .link-register {
      color: #FF6200;
      text-decoration: none;
      font-weight: 500;
    }
    .link-register:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  isLoading = false;

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password } = this.loginForm.value;
      
      this.authService.login(username, password).subscribe({
        next: () => {
          this.toastr.success('Login realizado com sucesso!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error(err?.message || 'Credenciais inválidas', 'Erro de autenticação');
        }
      });
    }
  }
}