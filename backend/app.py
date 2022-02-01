from flask import Flask, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS  # comment this on deployment
from api.HelloApiHandler import HelloApiHandler
from api.question_handler import QuestionHandler
from spec_rqa.rqa_parser import RQAParser
import json

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
CORS(app)  # comment this on deployment
api = Api(app)


@app.route("/", defaults={'path': ''})
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')


@app.route("/segments", methods=['GET'])
def get_segments():
    parser = reqparse.RequestParser()
    parser.add_argument('sentence', type=str)
    sentence = parser.parse_args()['sentence']
    sentence = 'If it is a directory, NFS4ERR_ISDIR is returned; otherwise, NFS4ERR_SYMLINK is returned.'
    segments = RQAParser.get_segments(sentence)
    return json.dumps(segments)

@app.route("/questions", methods=['GET'])
def get_questions():
    parser = reqparse.RequestParser()
    parser.add_argument('segment', type=str)
    parser.add_argument('segment', type=str)
    sentence = parser.parse_args()['sentence']
    sentence = 'If it is a directory, NFS4ERR_ISDIR is returned; otherwise, NFS4ERR_SYMLINK is returned.'
    segments = RQAParser.get_segments(sentence)
    return json.dumps(segments)

if __name__ == '__main__':
    app.run(host="localhost", port=5050, debug=True)
