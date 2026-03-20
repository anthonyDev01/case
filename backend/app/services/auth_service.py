import bcrypt
from app.repositories.user_repository import UserRepository
from app.models.user import User
from flask_jwt_extended import create_access_token

class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()

    def login(self, username, password):
        user = self.user_repo.get_by_username(username)
        if not user:
            return None, "Credenciais inválidas"
        
        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            return None, "Credenciais inválidas"

        access_token = create_access_token(identity=str(user.id))
        return {
            "access_token": access_token,
            "user": {
                "id": user.id,
                "username": user.username
            }
        }, None

    def register(self, username, email, password):
        existing = self.user_repo.get_by_username(username)
        if existing:
            return None, "Nome de usuário já está em uso"

        existing_email = self.user_repo.get_by_email(email)
        if existing_email:
            return None, "E-mail já cadastrado"

        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(username=username, email=email, password_hash=password_hash)
        self.user_repo.create(user)

        return {"message": "Usuário criado com sucesso"}, None