from flask import Flask, Blueprint
from flasgger import Swagger
from graficos.routes import graficos_bp
from transacoes.routes import transacoes_bp

app = Flask(__name__)
swagger = Swagger(app)

register_bluenprint = Blueprint('blueprint', __name__)

app.register_blueprint(graficos_bp)
app.register_blueprint(transacoes_bp)

if __name__ == '__main__':
    app.run(debug=True)
