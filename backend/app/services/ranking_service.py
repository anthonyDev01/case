from app.repositories.game_repository import GameRepository

class RankingService:
    def __init__(self):
        self.game_repo = GameRepository()
        
    def get_ranking(self):
        games = self.game_repo.get_ranking()
        result = []
        for i, game in enumerate(games):
            result.append({
                "position": i + 1,
                "username": game.user.username,
                "attempts": game.attempts_count,
                "duration_seconds": game.duration_seconds,
                "finished_at": game.finished_at.isoformat() if game.finished_at else None
            })
        return result
