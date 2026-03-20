import bcrypt
from datetime import datetime, timedelta
from main import create_app
from app.extensions import db
from app.models.user import User
from app.models.game import Game
from app.models.attempt import Attempt

def seed_database():
    app = create_app()
    with app.app_context():
        print("Limpando banco de dados...")
        db.drop_all()
        db.create_all()

        print("Criando usuários de teste...")
        password_hash = bcrypt.hashpw('senha123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        player1 = User(username='player1', email='player1@mastermind.com', password_hash=password_hash)
        player2 = User(username='player2', email='player2@mastermind.com', password_hash=password_hash)
        
        db.session.add(player1)
        db.session.add(player2)
        db.session.commit()

        print("Criando partidas simuladas para popular o ranking...")
        
        # Player 1 Ganhou rápido
        g1 = Game(user_id=player1.id, secret_code="1,2,3,4", status="won", attempts_count=3,
                  started_at=datetime.utcnow() - timedelta(minutes=10),
                  finished_at=datetime.utcnow() - timedelta(minutes=9), duration_seconds=60)
        db.session.add(g1)
        db.session.commit()
        
        # Inserindo attempts do g1
        a1 = Attempt(game_id=g1.id, attempt_number=1, digits="1,4,2,5", correct_positions=1, wrong_positions=2)
        a2 = Attempt(game_id=g1.id, attempt_number=2, digits="1,2,6,5", correct_positions=2, wrong_positions=0)
        a3 = Attempt(game_id=g1.id, attempt_number=3, digits="1,2,3,4", correct_positions=4, wrong_positions=0)
        db.session.add_all([a1, a2, a3])

        # Player 2 Ganhou mais rapido mas com mais tentativas
        g2 = Game(user_id=player2.id, secret_code="5,5,6,6", status="won", attempts_count=5,
                  started_at=datetime.utcnow() - timedelta(minutes=30),
                  finished_at=datetime.utcnow() - timedelta(minutes=29, seconds=15), duration_seconds=45)
        db.session.add(g2)
        db.session.commit()

        db.session.commit()

        print("Base de dados populada com sucesso!")
        print("Usuários criados:")
        print("- player1 / senha123")
        print("- player2 / senha123")

if __name__ == "__main__":
    seed_database()
