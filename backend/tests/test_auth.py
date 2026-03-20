import pytest
from app.services.auth_service import AuthService
from app.models.user import User
import bcrypt

def test_auth_login_success(mocker):
    service = AuthService()
    
    password_hash = bcrypt.hashpw('senha123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    mock_user = User(id=1, username="player1", password_hash=password_hash)
    
    mocker.patch('app.repositories.user_repository.UserRepository.get_by_username', return_value=mock_user)
    mocker.patch('app.services.auth_service.create_access_token', return_value="jwt-dev-token")
    
    result, error = service.login("player1", "senha123")
    
    assert error is None
    assert result["access_token"] == "jwt-dev-token"

def test_auth_login_invalid_password(mocker):
    service = AuthService()
    
    password_hash = bcrypt.hashpw('senha123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    mock_user = User(id=1, username="player1", password_hash=password_hash)
    
    mocker.patch('app.repositories.user_repository.UserRepository.get_by_username', return_value=mock_user)
    
    result, error = service.login("player1", "wrongpassword")
    
    assert result is None
    assert error == "Credenciais inválidas"
