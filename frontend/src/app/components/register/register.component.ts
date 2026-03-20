import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  if (password && confirm && password.value !== confirm.value) {
    confirm.setErrors({ passwordMismatch: true });
  } else {
    confirm?.setErrors(null);
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Criar Conta</mat-card-title>
          <mat-card-subtitle>Cadastre-se para jogar Mastermind</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nome de usuário</mat-label>
              <input matInput formControlName="username" />
              <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
                Usuário é obrigatório
              </mat-error>
              <mat-error *ngIf="registerForm.get('username')?.hasError('minlength')">
                Mínimo 3 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>E-mail</mat-label>
              <input matInput type="email" formControlName="email" />
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                E-mail é obrigatório
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                E-mail inválido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Senha</mat-label>
              <input matInput type="password" formControlName="password" />
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Senha é obrigatória
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Mínimo 6 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirmar senha</mat-label>
              <input matInput type="password" formControlName="confirmPassword" />
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                Confirmação é obrigatória
              </mat-error>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('passwordMismatch')">
                As senhas não coincidem
              </mat-error>
            </mat-form-field>

            <button mat-flat-button class="btn-primary full-width" type="submit" [disabled]="registerForm.invalid || isLoading">
              {{ isLoading ? 'Cadastrando...' : 'Criar Conta' }}
            </button>

          </form>
        </mat-card-content>

        <mat-card-footer class="card-footer">
          <span>Já tem uma conta?</span>
          <a routerLink="/login" class="link-login">Entrar</a>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    .register-card {
      width: 100%;
      max-width: 420px;
      padding: 16px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 12px;
    }
    mat-card-header {
      margin-bottom: 24px;
      justify-content: center;
      text-align: center;
    }
    mat-card-title {
      font-size: 24px;
      color: #FF6200;
      font-weight: 500;
    }
    .card-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      padding: 16px;
      font-size: 14px;
      color: #666;
    }
    .link-login {
      color: #FF6200;
      text-decoration: none;
      font-weight: 500;
    }
    .link-login:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  isLoading = false;

  registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator });

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { username, email, password } = this.registerForm.value;

      this.authService.register(username, email, password).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastr.success('Conta criada com sucesso! Faça login para continuar.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error(err?.error?.error || 'Erro ao criar conta', 'Erro');
        }
      });
    }
  }
}