from app.models.game import Game
from app.models.attempt import Attempt
from app.extensions import db

class GameRepository:
    def create_game(self, game: Game):
        db.session.add(game)
        db.session.commit()
        return game

    def get_game_by_id(self, game_id: int):
        return Game.query.get(game_id)

    def update_game(self):
        db.session.commit()

    def create_attempt(self, attempt: Attempt):
        db.session.add(attempt)
        db.session.commit()
        return attempt
        
    def get_ranking(self, limit=20):
        from sqlalchemy import func
        best_per_user = db.session.query(
            Game.user_id,
            func.min(Game.attempts_count).label('min_attempts'),
            func.min(Game.duration_seconds).label('min_duration')
        ).filter(
            Game.status == 'won'
        ).group_by(Game.user_id).subquery()

        ranking = db.session.query(Game).join(
            best_per_user,
            db.and_(
                Game.user_id == best_per_user.c.user_id,
                Game.attempts_count == best_per_user.c.min_attempts,
                Game.duration_seconds == best_per_user.c.min_duration
            )
        ).filter(
            Game.status == 'won'
        ).order_by(
            Game.attempts_count.asc(),
            Game.duration_seconds.asc(),
            Game.finished_at.desc()
        ).limit(limit).all()

        return ranking
