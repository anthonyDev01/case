import pytest
from main import create_app
from app.extensions import db
from app.models.user import User
import bcrypt

def test_health(client):
    response = client.get('/health')
    assert response.status_code == 200

def test_login_endpoint(client):
    response = client.post('/auth/login', json={"username": "player1", "password": "senha123"})
    assert response.status_code == 200
    assert "access_token" in response.json
