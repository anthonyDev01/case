from flask_smorest import Blueprint
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.game_service import GameService
from app.schemas.schemas import AttemptRequestSchema

game_blp = Blueprint("games", "games", url_prefix="/games", description="Gerenciamento do Jogo Mastermind")
game_service = GameService()

@game_blp.route("", methods=["POST"])
@jwt_required()
def create_game():
    """Inicia uma nova partida para o usuário logado."""
    user_id = int(get_jwt_identity())
    result = game_service.create_new_game(user_id)
    return jsonify(result), 201

@game_blp.route("/<int:game_id>/attempt", methods=["POST"])
@jwt_required()
@game_blp.arguments(AttemptRequestSchema)
def make_attempt(payload, game_id):
    """Envia uma tentativa de adivinhação da combinação."""
    user_id = int(get_jwt_identity())
    result, status_code, error = game_service.process_attempt(game_id, user_id, payload['digits'])
    
    if error:
        return jsonify({"error": error}), status_code
        
    return jsonify(result), status_code

@game_blp.route("/<int:game_id>", methods=["GET"])
@jwt_required()
def get_game(game_id):
    """Retorna o estado da partida."""
    user_id = int(get_jwt_identity())
    result, status_code, error = game_service.get_game_state(game_id, user_id)
    
    if error:
        return jsonify({"error": error}), status_code
        
    return jsonify(result), status_code
