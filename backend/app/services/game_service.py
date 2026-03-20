import random
from datetime import datetime
from app.models.game import Game
from app.models.attempt import Attempt
from app.repositories.game_repository import GameRepository

class GameService:
    def __init__(self):
        self.game_repo = GameRepository()
        self.MAX_ATTEMPTS = 10

    def create_new_game(self, user_id):
        # Generate secret code: 4 digits, 1 to 6
        secret_code = ",".join([str(random.randint(1, 6)) for _ in range(4)])
        game = Game(user_id=user_id, secret_code=secret_code)
        self.game_repo.create_game(game)
        return {"game_id": game.id, "max_attempts": self.MAX_ATTEMPTS}

    def process_attempt(self, game_id, user_id, digits_list):
        game = self.game_repo.get_game_by_id(game_id)
        if not game:
            return None, 404, "Partida não encontrada"
        if game.user_id != user_id:
            return None, 403, "Acesso negado"

        if game.status != 'ongoing':
            return None, 409, "Partida já encerrada"

        if len(digits_list) != 4 or not all(1 <= d <= 6 for d in digits_list):
            return None, 400, "Dígitos devem ser entre 1 e 6 e tamanho exato 4"

        secret_digits = [int(x) for x in game.secret_code.split(",")]
        guess_digits = digits_list.copy()

        correct_positions = 0
        wrong_positions = 0

        # Step 1: Check correct positions
        secret_matched = [False] * 4
        guess_matched = [False] * 4

        for i in range(4):
            if guess_digits[i] == secret_digits[i]:
                correct_positions += 1
                secret_matched[i] = True
                guess_matched[i] = True

        # Step 2: Check wrong positions
        for i in range(4):
            if guess_matched[i]:
                continue
            for j in range(4):
                if not secret_matched[j] and guess_digits[i] == secret_digits[j]:
                    wrong_positions += 1
                    secret_matched[j] = True
                    break # Don't match this guess digit again

        game.attempts_count += 1
        
        attempt_record = Attempt(
            game_id=game.id,
            attempt_number=game.attempts_count,
            digits=",".join(map(str, digits_list)),
            correct_positions=correct_positions,
            wrong_positions=wrong_positions
        )
        self.game_repo.create_attempt(attempt_record)

        # Update game status
        if correct_positions == 4:
            game.status = 'won'
            game.finished_at = datetime.utcnow()
            if game.started_at:
                game.duration_seconds = int((game.finished_at - game.started_at).total_seconds())
            else:
                game.duration_seconds = 0
        elif game.attempts_count >= self.MAX_ATTEMPTS:
            game.status = 'lost'
            game.finished_at = datetime.utcnow()
            if game.started_at:
                game.duration_seconds = int((game.finished_at - game.started_at).total_seconds())
            else:
                game.duration_seconds = 0

        self.game_repo.update_game()

        result = {
            "attempt_number": game.attempts_count,
            "correct_positions": correct_positions,
            "wrong_positions": wrong_positions,
            "status": game.status,
            "attempts_left": self.MAX_ATTEMPTS - game.attempts_count
        }

        # If lost, include the secret code
        if game.status == 'lost':
            result["secret_code"] = secret_digits

        return result, 200, None

    def get_game_state(self, game_id, user_id):
        game = self.game_repo.get_game_by_id(game_id)
        if not game:
            return None, 404, "Partida não encontrada"
        if game.user_id != user_id:
            return None, 403, "Acesso negado"

        attempts = []
        for att in game.attempts:
            attempts.append({
                "attempt_number": att.attempt_number,
                "digits": [int(x) for x in att.digits.split(',')],
                "correct_positions": att.correct_positions,
                "wrong_positions": att.wrong_positions
            })

        result = {
            "game_id": game.id,
            "status": game.status,
            "attempts": attempts,
            "attempts_left": max(0, self.MAX_ATTEMPTS - game.attempts_count)
        }
        
        if game.status == 'lost':
            result["secret_code"] = [int(x) for x in game.secret_code.split(',')]
            
        return result, 200, None
