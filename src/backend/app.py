from flask import Flask, Blueprint
from flask_cors import CORS
from graficos.routes import graficos_bp
from transacoes.routes import transacoes_bp
from insights.routes import insights_bp
from usuario.routes import usuario_bp
from util.config import Config
from flask_jwt_extended import JWTManager

app = Flask(__name__)

# Configuração do app
app.config.from_object(Config)

# Configuração JWT
jwt = JWTManager(app)

# Configuração CORS
CORS(app)

register_blueprint = Blueprint('blueprint', __name__)

# Registrando os blueprints
app.register_blueprint(graficos_bp)
app.register_blueprint(transacoes_bp)
app.register_blueprint(insights_bp)
app.register_blueprint(usuario_bp)

if __name__ == '__main__':
    app.run(debug=True)
