from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidHeaderError
from jwt.exceptions import ExpiredSignatureError, DecodeError


def register_error_handlers(app):

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Requisição inválida", "details": str(e)}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({"error": "Não autorizado"}), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({"error": "Acesso negado"}), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Recurso não encontrado"}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"error": "Método não permitido"}), 405

    @app.errorhandler(409)
    def conflict(e):
        return jsonify({"error": "Conflito com o estado atual do recurso"}), 409

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Erro interno do servidor"}), 500

    @app.errorhandler(SQLAlchemyError)
    def database_error(e):
        return jsonify({"error": "Erro no banco de dados", "details": str(e)}), 500

    @app.errorhandler(NoAuthorizationError)
    def no_auth_error(e):
        return jsonify({"error": "Token não fornecido"}), 401

    @app.errorhandler(InvalidHeaderError)
    def invalid_header_error(e):
        return jsonify({"error": "Token inválido no header"}), 401

    @app.errorhandler(ExpiredSignatureError)
    def expired_token_error(e):
        return jsonify({"error": "Token expirado, faça login novamente"}), 401

    @app.errorhandler(DecodeError)
    def decode_error(e):
        return jsonify({"error": "Token malformado"}), 401

    @app.errorhandler(Exception)
    def unhandled_exception(e):
        app.logger.error(f"Unhandled exception: {str(e)}", exc_info=True)
        return jsonify({"error": "Erro inesperado", "details": str(e)}), 500