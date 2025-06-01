from flask import Flask
from backend.routes import dailyinput_bp
from flask_cors import CORS

app = Flask(__name__)
app.register_blueprint(dailyinput_bp)
CORS(app)

if __name__ == "__main__":
    app.run(debug=True, port=5002)



