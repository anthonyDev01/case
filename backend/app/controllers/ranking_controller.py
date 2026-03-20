from flask_smorest import Blueprint
from flask import jsonify
from flask_jwt_extended import jwt_required
from app.services.ranking_service import RankingService

ranking_blp = Blueprint("ranking", "ranking", url_prefix="/ranking", description="Visualizar ranking")
ranking_service = RankingService()

@ranking_blp.route("", methods=["GET"])
@jwt_required()
def get_ranking():
    """Retorna o top global de jogadores baseando-se em tentativas e tempo."""
    result = ranking_service.get_ranking()
    return jsonify(result), 200
