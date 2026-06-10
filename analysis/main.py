from flask import Flask, request, jsonify
import pandas as pd
import analysis

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "EDA API is running"})

@app.route("/analysis", methods=["POST"])
def run_analysis():

    # 1. check file exists
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    try:
        df = pd.read_csv(file, encoding="latin1")
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    
    result = analysis.data_analysis(df)


    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)