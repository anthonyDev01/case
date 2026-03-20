import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import pytest
from main import create_app
from app.extensions import db
from app.models.user import User
import bcrypt

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"

    with app.app_context():
        db.drop_all()
        db.create_all()
        password_hash = bcrypt.hashpw('senha123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        player1 = User(username='player1', password_hash=password_hash)
        db.session.add(player1)
        db.session.commit()

    with app.test_client() as client:
        yield client