import pytest
from app.services.game_service import GameService
from app.models.game import Game

def test_game_logic_exact_match(mocker):
    service = GameService()
    
    game_mock = Game(id=1, user_id=1, secret_code="1,2,3,4", status="ongoing", attempts_count=0)
    mocker.patch('app.repositories.game_repository.GameRepository.get_game_by_id', return_value=game_mock)
    mocker.patch('app.repositories.game_repository.GameRepository.create_attempt', return_value=None)
    mocker.patch('app.repositories.game_repository.GameRepository.update_game', return_value=None)
    
    result, status, _ = service.process_attempt(1, 1, [1, 2, 3, 4])
    assert status == 200
    assert result["correct_positions"] == 4
    assert result["wrong_positions"] == 0
    assert result["status"] == "won"

def test_game_logic_mixed_match(mocker):
    service = GameService()
    
    game_mock = Game(id=1, user_id=1, secret_code="1,2,3,4", status="ongoing", attempts_count=0)
    mocker.patch('app.repositories.game_repository.GameRepository.get_game_by_id', return_value=game_mock)
    mocker.patch('app.repositories.game_repository.GameRepository.create_attempt', return_value=None)
    mocker.patch('app.repositories.game_repository.GameRepository.update_game', return_value=None)
    
    result, status, _ = service.process_attempt(1, 1, [1, 4, 2, 5])
    assert status == 200
    assert result["correct_positions"] == 1
    assert result["wrong_positions"] == 2
    
def test_game_logic_duplicates_in_guess(mocker):
    service = GameService()
    
    # Secret code: 1,2,3,4
    game_mock = Game(id=1, user_id=1, secret_code="1,2,3,4", status="ongoing", attempts_count=0)
    mocker.patch('app.repositories.game_repository.GameRepository.get_game_by_id', return_value=game_mock)
    mocker.patch('app.repositories.game_repository.GameRepository.create_attempt', return_value=None)
    mocker.patch('app.repositories.game_repository.GameRepository.update_game', return_value=None)
    
    # Guess with duplicates: [2, 2, 2, 2] -> Should only count 1 wrong position (since there is only one "2" in secret)
    result, status, _ = service.process_attempt(1, 1, [2, 2, 2, 2])
    assert status == 200
    assert result["correct_positions"] == 1 # 2 at index 1 matches "1,2,3,4" at index 1
    assert result["wrong_positions"] == 0   # The other '2's should not count since the '2' in secret was already matched.
