from flask import Flask, Blueprint
from graficos.routes import graficos_bp
from transacoes.routes import transacoes_bp
from insights.routes import insights_bp

app = Flask(__name__)

register_bluenprint = Blueprint('blueprint', __name__)

app.register_blueprint(graficos_bp)
app.register_blueprint(transacoes_bp)
app.register_blueprint(insights_bp)

if __name__ == '__main__':
    app.run(debug=True)
