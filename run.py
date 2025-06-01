from flask import Flask
from backend.routes import dailyinput_bp

app = Flask(__name__)
app.register_blueprint(dailyinput_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5002)



