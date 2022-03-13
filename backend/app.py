from flask import Flask, send_from_directory, request, Response
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS  # comment this on deployment
from spec_rqa.rqa_parser import RQAParser
from pymongo import MongoClient
from helpers import serialize_records
import json

cluster = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
client = MongoClient(cluster)
db = client.RecursiveQA

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
    # sentence = 'If it is a directory, NFS4ERR_ISDIR is returned; otherwise, NFS4ERR_SYMLINK is returned.'
    segments = RQAParser.get_segments(sentence)
    return json.dumps(segments)


@app.route("/questions", methods=['GET'])
def get_questions():
    parser = reqparse.RequestParser()
    parser.add_argument('segment', type=str)
    segment = parser.parse_args()['segment']
    print(segment, 'here')
    # segment = 'If it is a directory, NFS4ERR_ISDIR is returned'
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
    answers = RQAParser.get_answers(question, segment, template)
    return json.dumps(answers)


@app.route("/login", methods=['POST'])
def login():
    user = json.loads(request.get_json(force=True))
    if not db.users.find_one({'email': user['email']}):
        db.users.insert_one(user)
    return Response(status=200)


@app.route("/upload", methods=['POST'])
def post_sentences():
    data = request.get_json(force=True)
    sentences = data['sentences']
    user = data['user']
    records = []
    for sentence in sentences:
        records.append({'user': user['email'], 'sentence': sentence, 'status': 'incomplete'})
    db.records.insert_many(records)
    return Response(status=200)


@app.route("/records", methods=['POST'])
def get_records():
    user_requester = request.get_json(force=True)['user']
    db_user = db.users.find_one({'email': user_requester['email']})
    if user_requester['googleId'] != db_user['googleId']:
        return Response(status=404)
    records = serialize_records(db.records.find({'user': user_requester['email']}))
    return Response(response=records, status=200, content_type='application/json')


@app.route("/sentence", methods=['GET'])
def get_sentence():
    return json.dumps(
        {'sentence': "If it is a directory, NFS4ERR_ISDIR is returned; otherwise, NFS4ERR_SYMLINK is returned."})


if __name__ == '__main__':
    app.run(host="localhost", port=5050, debug=True)
