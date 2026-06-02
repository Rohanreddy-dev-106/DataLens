from flask import Flask,request,jsonify
import analysis
app = Flask(__name__)

@app.route("/",methods=["GET"])
def home():
    data=analysis.data_analysis("xyx")
    return data



@app.route("/show/<post_id>",methods=["GET"])
def show_post(post_id):
    # show the post with the given id, the id is an integer
    return f'Post {post_id}'

if __name__ == "__main__":
    app.run(debug=True)