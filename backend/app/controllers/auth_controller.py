from flask_smorest import Blueprint
from flask import jsonify, request
from app.services.auth_service import AuthService
from app.schemas.schemas import LoginRequestSchema, RegisterRequestSchema

auth_blp = Blueprint("auth", "auth", url_prefix="/auth", description="Autenticação do sistema")
auth_service = AuthService()

@auth_blp.route("/login", methods=["POST"])
@auth_blp.arguments(LoginRequestSchema)
def login(payload):
    """Realiza o login e gera um JWT."""
    result, error = auth_service.login(payload['username'], payload['password'])
    
    if error:
        return jsonify({"error": error}), 401
        
    return jsonify(result), 200

@auth_blp.route("/register", methods=["POST"])
@auth_blp.arguments(RegisterRequestSchema)
def register(payload):
    """Cadastra um novo usuário."""
    result, error = auth_service.register(payload['username'], payload['email'], payload['password'])
    if error:
        return jsonify({"error": error}), 400
    return jsonify(result), 201
