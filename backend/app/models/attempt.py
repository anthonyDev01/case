from datetime import datetime
from app.extensions import db

class Attempt(db.Model):
    __tablename__ = 'attempts'

    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)
    attempt_number = db.Column(db.Integer, nullable=False)
    digits = db.Column(db.String(20), nullable=False) # ex: "1,4,2,5"
    correct_positions = db.Column(db.Integer, nullable=False)
    wrong_positions = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    game = db.relationship('Game', back_populates='attempts')
