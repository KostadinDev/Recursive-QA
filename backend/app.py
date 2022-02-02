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
    #sentence = 'If it is a directory, NFS4ERR_ISDIR is returned; otherwise, NFS4ERR_SYMLINK is returned.'
    segments = RQAParser.get_segments(sentence)
    print("WHAT IS WRONG DUDE?")
    return json.dumps(segments)


@app.route("/questions", methods=['GET'])
def get_questions():
    parser = reqparse.RequestParser()
    parser.add_argument('segment', type=str)
    segment = parser.parse_args()['segment']
    print(segment,'here')
    #segment = 'If it is a directory, NFS4ERR_ISDIR is returned'
    questions = RQAParser.get_questions(segment)
    return json.dumps(questions)


@app.route("/answers", methods=['GET'])
def get_answers():
    parser = reqparse.RequestParser()
    parser.add_argument('segment', type=str)
    parser.add_argument('question', type=str)
    parser.add_argument('template', type=int)
    segment = parser.parse_args()['segment']
    question = parser.parse_args()['question']
    template = parser.parse_args()['template']
    segment = 'If it is a directory, NFS4ERR_ISDIR is returned'
    question = 'If it is a directory'
    template = 0
    answers = RQAParser.get_answers(question, segment, template)
    return json.dumps(answers)


@app.route("/sentence", methods=['GET'])
def get_sentence():
    return json.dumps(
        {'sentence': "If it is a directory, NFS4ERR_ISDIR is returned; otherwise, NFS4ERR_SYMLINK is returned."})


if __name__ == '__main__':
    app.run(host="localhost", port=5050, debug=True)
