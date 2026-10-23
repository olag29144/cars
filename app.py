import json
import os
from flask import Flask, render_template, jsonify

app = Flask(__name__)

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "models.json")


def load_models():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


@app.route("/")
def index():
    models = load_models()
    return render_template("index.html", models=models)


@app.route("/api/models")
def api_models():
    models = load_models()
    return jsonify(models)


@app.route("/api/models/<model_id>")
def api_model(model_id):
    models = load_models()
    model = next((m for m in models if m["id"] == model_id), None)
    if model is None:
        return jsonify({"error": "Model not found"}), 404
    return jsonify(model)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
