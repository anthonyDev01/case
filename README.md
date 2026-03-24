# Mastermind Fullstack - Case Itaú

Bem-vindo ao repositório do projeto **Mastermind**, um sistema Fullstack completo desenvolvido para a resolução do case técnico.

A aplicação simula o clássico jogo de adivinhação, onde o usuário deve descobrir um código secreto gerado pelo servidor em um número limitado de tentativas, contando com feedbacks visuais baseados na assertividade dos seus pinos (Correto na posição certa ou Correto na posição errada).

A interface gráfica foi desenhada simulando ambientes e portais de instituições financeiras modernas (ex: Itaú), focando em experiência minimalista cor "laranja/branco" e feedbacks ricos.

---

## 🛠 Arquitetura e Decisões Técnicas

O projeto foi inteiramente separado em dois grandes blocos: Backend e Frontend, desacoplados, se comunicando exclusivamente via API REST.

- **Backend (Python)**: Utilizou-se o Flask com separação explícita de camadas: `Controllers` para rotas e inputs, `Services` contendo as regras de negócio do algoritmo, `Repositories` para abstrair as consultas efetuadas pelo SQLAlchemy, e a declaração de `Models`. Essa arquitetura facilita escalabilidade e testes.
- **Frontend (Angular)**: Construído nativamente com **Standalone Components** na versão v21. Comunicação via Services HttpClient, interceptação de chamadas com JWT no estilo funcional e proteção de rotas via AuthGuards. Todo o esteticismo foi feito utilizando as matrizes componentes do **Angular Material**.

### Tecnologias e Versões

**Backend:**
- Python 3.11+
- Flask 3.0+
- Flask-SQLAlchemy (PostgreSQL via psycopg2)
- Flask-JWT-Extended (Autorização Tokenizada)
- Flask-Smorest / Marshmallow (REST + Swagger)
- PostgreSQL 15 (banco de dados)
- Docker + Docker Compose (containerização)
- Pytest (Testes unitários)

**Frontend:**
- Node.js 20+
- Angular CLI + Framework v21
- Angular Material v21
- ngx-toastr (Notificações)
- Vitest (Testes unitários)

---

## 🐳 Opção 1 — Rodar com Docker (Recomendado)

> **Pré-requisito:** Ter o [Docker Desktop](https://www.docker.com/get-started/) instalado e rodando.

### Passo a passo

**1. Clone o repositório e acesse a pasta raiz:**
```bash
git clone <url-do-repositorio>
cd <nome-da-pasta>
```

**2. Crie o arquivo `.env` na raiz do projeto:**

Windows (PowerShell):
```powershell
Copy-Item .env.example .env
```

Linux/Mac:
```bash
cp backend/.env.example backend/.env
```

Abra o `.env` criado e preencha os valores das variáveis antes de continuar.

**3. Suba todos os serviços com um único comando:**
```bash
docker-compose up --build
```

Aguarde o build completo. Na primeira vez pode levar alguns minutos.

**4. Em outro terminal, popule o banco com dados iniciais:**
```bash
docker-compose exec backend python seed.py
```

### Acessos

| Serviço  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:4200        |
| Backend  | http://localhost:5000        |
| Swagger  | http://localhost:5000/swagger|

### Usuários de teste

| Usuário | Senha    |
|---------|----------|
| player1 | senha123 |
| player2 | senha123 |

### Parar os serviços
```bash
docker-compose down
```

---

## ⚙️ Opção 2 — Rodar Manualmente (sem Docker)

> Use esta opção caso não tenha Docker instalado.

**Pré-requisitos:**
- Python 3.11+
- Node.js 20+
- PostgreSQL rodando localmente (ou SQLite, veja abaixo)

---

### 1️⃣ Backend

Acesse a pasta do backend:
```bash
cd backend
```

**Crie e ative o ambiente virtual:**

Windows:
```bash
python -m venv venv
venv\Scripts\activate
```

Linux/Mac:
```bash
python -m venv venv
source venv/bin/activate
```

**Instale as dependências:**
```bash
pip install -r requirements.txt
```

**Configure o `.env`:**
```bash
cp .env.example .env
```

Abra o `.env` e ajuste a `DATABASE_URL` conforme seu ambiente:

Com PostgreSQL local:
```env
DATABASE_URL=postgresql://mastermind_user:mastermind_pass@localhost:5432/mastermind
```

Com SQLite (mais simples, sem precisar de PostgreSQL):
```env
DATABASE_URL=sqlite:///mastermind.db
```

**Popule o banco:**
```bash
python seed.py
```

**Inicie o backend:**
```bash
flask run
```

> Se der erro de `FLASK_APP`, rode antes:
>
> Windows: `$env:FLASK_APP = "main.py"`
>
> Linux/Mac: `export FLASK_APP=main.py`

A API ficará disponível em `http://localhost:5000`.

---

### 2️⃣ Frontend

Em outro terminal, acesse a pasta do frontend:
```bash
cd frontend
```

**Instale as dependências:**
```bash
npm install --legacy-peer-deps
```

**Inicie o frontend:**
```bash
npx ng serve
```

Acesse no browser: `http://localhost:4200`

---

## 🔐 Variáveis de Ambiente (`.env.example`)

```env
DATABASE_URL=postgresql://mastermind_user:mastermind_pass@db:5432/mastermind
SECRET_KEY=sua_chave_secreta
JWT_SECRET_KEY=sua_chave_jwt
JWT_ACCESS_TOKEN_EXPIRES=86400
```

| Variável                  | Descrição                                              |
|---------------------------|--------------------------------------------------------|
| `DATABASE_URL`            | URI de conexão com o banco (PostgreSQL ou SQLite)      |
| `SECRET_KEY`              | Chave secreta do Flask                                 |
| `JWT_SECRET_KEY`          | Chave de criptografia dos tokens JWT                   |
| `JWT_ACCESS_TOKEN_EXPIRES`| Tempo de expiração do token em segundos (padrão: 24h) |

---

## 📚 Documentação da API

Todos os endpoints estão documentados interativamente via Swagger em:
```
http://localhost:5000/swagger
```

### Auth
| Método | Endpoint         | Descrição                        | Auth |
|--------|-----------------|----------------------------------|------|
| POST   | /auth/login     | Login e geração de JWT           | ❌   |
| POST   | /auth/register  | Cadastro de novo usuário         | ❌   |

### Games
| Método | Endpoint              | Descrição                              | Auth |
|--------|-----------------------|----------------------------------------|------|
| POST   | /games                | Cria nova partida                      | ✅   |
| POST   | /games/{id}/attempt   | Envia uma tentativa                    | ✅   |
| GET    | /games/{id}           | Retorna estado atual da partida        | ✅   |

### Ranking
| Método | Endpoint   | Descrição                                      | Auth |
|--------|-----------|------------------------------------------------|------|
| GET    | /ranking  | Lista melhores jogadores (1 resultado por user)| ✅   |

**Critério de ordenação do ranking:**
1. Menor número de tentativas
2. Menor tempo de duração
3. Data mais recente em caso de empate

---

## 🧪 Testes

### Backend
```bash
cd backend
venv\Scripts\activate  # ou source venv/bin/activate no Linux/Mac
pytest -s
```

### Frontend
```bash
cd frontend
npx ng test
```

---

## 💡 Fluxo da Aplicação

1. Usuário acessa `http://localhost:4200` → redirecionado para **Login**
2. Faz login ou cria uma conta em **Cadastro**
3. Após login, acessa o **Dashboard** com opções de Nova Partida e Ranking
4. Na tela do **Jogo**, digita 4 dígitos (1–6) por tentativa
5. O backend valida e retorna pinos de feedback:
   - 🟠 Pino laranja = dígito na posição correta
   - ⚪ Pino cinza = dígito certo, posição errada
6. Ao vencer ou esgotar 10 tentativas, exibe resultado
7. O **Ranking** mostra o melhor resultado de cada jogador