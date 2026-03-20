import os
from flask import Flask
from dotenv import load_dotenv

from app.config import Config
from app.extensions import db, jwt, cors
from app.error_handlers import register_error_handlers

# Importar controllers (endpoints) após inicializar models para evitar circular imports
# from app.controllers.auth_controller import auth_blp
# from app.controllers.game_controller import game_blp
# from app.controllers.ranking_controller import ranking_blp

def create_app():
    load_dotenv()
    
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "*"}})

    register_error_handlers(app)

    # Import controllers inside the factory to avoid circular imports.
    from app.controllers.auth_controller import auth_blp
    from app.controllers.game_controller import game_blp
    from app.controllers.ranking_controller import ranking_blp

    # Setup Swagger API
    from flask_smorest import Api
    api = Api(app)
    api.register_blueprint(auth_blp)
    api.register_blueprint(game_blp)
    api.register_blueprint(ranking_blp)

    with app.app_context():
        # Create all database tables
        db.create_all()

    @app.route("/health", methods=["GET"])
    def health_check():
        return {"status": "ok"}

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
