from datetime import datetime
from app.extensions import db

class Game(db.Model):
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    secret_code = db.Column(db.String(20), nullable=False) # Armazena como string "1,4,2,5"
    status = db.Column(db.String(20), default='ongoing') # ongoing, won, lost
    attempts_count = db.Column(db.Integer, default=0)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    finished_at = db.Column(db.DateTime, nullable=True)
    duration_seconds = db.Column(db.Integer, nullable=True)

    # Relacionamentos
    user = db.relationship('User', back_populates='games')
    attempts = db.relationship('Attempt', back_populates='game', lazy=True, cascade="all, delete-orphan")
