from flask import Flask, send_from_directory, request, Response
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS  # comment this on deployment
from spec_rqa.rqa_parser import RQAParser
from pymongo import MongoClient
# from helpers import serialize_records, build_annotation, get_sbar
import json
from flask_cors import CORS, cross_origin
from bson.objectid import ObjectId
import pprint

# cluster = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false" # local
cluster = "mongodb+srv://kostadindev:k8k9gVsmdtAzpdLp@cluster0.p3nsf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"  # cloud
client = MongoClient(cluster)
db = client.RecursiveQA

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
CORS(app)
api = Api(app)

cache = {}

import json
from pprint import pprint
import re


def serialize_records(records):
    records = list(records)
    for i in range(len(records)):
        records[i]['id'] = str(records[i]['_id'])
        records[i]['sentenceId'] = str(records[i]['sentenceId'])
        del records[i]['_id']
    return json.dumps({'records': records})


def is_const(text):
    # regex for extracting constants
    pattern = r'NFS(?![v])[a-zA-Z0-9_]+|NF(?![S])[a-zA-Z0-9_]+|[a-zA-Z0-9_]+_SYNC4*[a-zA-Z0-9_]*|ACCESS4*_[a-zA-Z0-9_]+|OPEN4*_[a-zA-Z0-9_]+|GUARDED4*|UNCHECKED4*|EXCLUSIVE4*|CLAIM_[a-zA-Z0-9_]+|UNSTABLE4*|RPCSEC_[a-zA-Z0-9_]*|CDFC[a-zA-Z0-9_]+|SECINFO[a-zA-Z0-9_]+|ACE4*[a-zA-Z0-9_]+|MODE4*[a-zA-Z0-9_]+|OPEN4*[a-zA-Z0-9_]+|UNCHECKED4*|NFS_[a-zA-Z0-9_]+'
    regexp = re.compile(pattern)
    return True if (regexp.search(text)) else False


def is_predicate(text, sbars):
    for sbar in sbars:
        if text in sbar:
            return True
        else:
            return False

def has_sbar(text, sbars):
    for sbar in sbars:
        if sbar in text:
            return True
        else:
            return False
def get_sbar(constituents):
    sbars = []
    keys = constituents.keys()
    for key in keys:
        if constituents[key]['label'] == 'SBAR':
            sbars.append(key)
    return sbars


def tag_sbars(node, sbars):
    for child in node['children']:
        if len(child['children']):
            tag_sbars(child, sbars)
        if has_sbar(child['text'], sbars) and child['relation'] is not None and child['relation']['type'] is None:
            child['relation']['type'] = "if_clause"


def tag_spans(node, sbars):
    for child in node['children']:
        if len(child['children']):
            tag_spans(child, sbars)
            child['type'] = "segment"
        elif child['text'] == node['relation']['qnode']:
            if is_predicate(child['text'], sbars):
                child['type'] = "predicate"
                node['relation']['type'] = 'argument'
            else:
                child['type'] = "function"
        elif child['text'] == node['relation']['anode']:
            if is_const(child['text']):
                child['type'] = "constant"
                node['relation']['type'] = "return_value"
            else:
                child['type'] = "variable"


def build_annotation(annotation, sbars):
    tag_spans(annotation, sbars)
    tag_sbars(annotation, sbars)
    return annotation

def check_cache(user, sentence):
    result = True
    if user not in cache.keys():
        cache[user] = {'constituents': None}
        result = False
    if not cache[user]['constituents'] or cache[user]['constituents']['sentence'] != sentence:
        result = False
    if len(cache) > 50:
        cache.clear()
    return result


def get_constituents(user, sentence):
    if check_cache(user, sentence):
        constituents = cache[user]
    else:
        constituents = db.constituents.find_one({"_id": ObjectId(sentence)})
        if constituents is None:
            return None
    return constituents['constituents']


@app.route("/", defaults={'path': ''})
@cross_origin()
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')


@app.route("/segments", methods=['GET'])
@cross_origin()
def get_segments():
    sentence = request.args['sentence']
    sentence_id = request.args['sentenceId']
    user = request.args['user']
    constituents = get_constituents(user, sentence_id)
    segments = RQAParser.get_segments(sentence, constituents)
    return json.dumps(segments)


@app.route("/questions", methods=['GET'])
@cross_origin()
def get_questions():
    segment = request.args['segment']
    sentence_id = request.args['sentenceId']
    user = request.args['user']
    constituents = get_constituents(user, sentence_id)
    questions = RQAParser.get_questions(segment, constituents)
    return json.dumps(questions)


@app.route("/answers", methods=['GET'])
@cross_origin()
def get_answers():
    segment = request.args['segment']
    sentence_id = request.args['sentenceId']
    user = request.args['user']
    question = request.args['question']
    template = int(request.args['template'])
    constituents = get_constituents(user, sentence_id)
    answers = RQAParser.get_answers(question, segment, template, constituents)
    return json.dumps(answers)


@app.route("/login", methods=['POST'])
@cross_origin()
def login():
    user = json.loads(request.get_json(force=True))
    if not db.users.find_one({'email': user['email']}):
        db.users.insert_one(user)
    return Response(status=200)


@app.route("/upload", methods=['POST'])
@cross_origin()
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
@cross_origin()
def get_records():
    user_requester = request.get_json(force=True)['user']
    db_user = db.users.find_one({'email': user_requester['email']})
    if user_requester['googleId'] != db_user['googleId']:
        return Response(status=404)
    records = serialize_records(db.records.find({'user': user_requester['email']}))
    return Response(response=records, status=200, content_type='application/json')


@app.route("/schedule", methods=['POST'])
@cross_origin()
def schedule():
    record_ids = request.get_json(force=True)['records']
    for i in range(len(record_ids)):
        record_ids[i] = ObjectId(record_ids[i])
    db_records = db.records.find({'_id': {'$in': record_ids}})
    for db_record in db_records:
        if 'scheduled' in db_record.keys():
            if db_record['scheduled'] is None or db_record['scheduled'] is False:
                new_scheduled = True
            else:
                new_scheduled = None
        else:
            new_scheduled = True
        id = db_record['_id']
        result = db.records.update_one({'_id': {"$eq": id}}, {'$set': {'scheduled': new_scheduled}})
    return Response(status=200, content_type='application/json')


@app.route("/flag", methods=['POST'])
@cross_origin()
def flag():
    record_ids = request.get_json(force=True)['records']
    for i in range(len(record_ids)):
        record_ids[i] = ObjectId(record_ids[i])
    db_records = db.records.find({'_id': {'$in': record_ids}})
    for db_record in db_records:
        if 'flagged' in db_record.keys():
            if db_record['flagged'] is None:
                new_flagged = True
            else:
                new_flagged = None
        else:
            new_flagged = True
        id = db_record['_id']
        result = db.records.update_one({'_id': {"$eq": id}}, {'$set': {'flagged': new_flagged}})
    return Response(status=200, content_type='application/json')


@app.route("/skip", methods=['POST'])
@cross_origin()
def skip():
    record_id = request.get_json(force=True)['record']
    record_id = ObjectId(record_id)
    result = db.records.update_one({'_id': {"$eq": record_id}}, {'$set': {'skipped': True, 'scheduled': False}})
    return Response(status=200, content_type='application/json')


@app.route("/remove", methods=['POST'])
@cross_origin()
def remove():
    record_ids = request.get_json(force=True)['records']
    for i in range(len(record_ids)):
        record_ids[i] = ObjectId(record_ids[i])
    result = db.records.delete_many({'_id': {'$in': record_ids}})
    return Response(status=200, content_type='application/json')


@app.route("/submit", methods=['POST'])
@cross_origin()
def submit():
    data = request.get_json(force=True)
    constituents = get_constituents(data['user'], data['sentenceId'])
    sbars = get_sbar(constituents)
    print("Here: ")
    print(sbars)
    data['annotation'] = build_annotation(data['annotation'], sbars)
    print(data['annotation'])
    result = db.records.update_one({'_id': {'$eq': ObjectId(data['record'])}},
                                   {"$set": {"history": data['history'], "annotation": data['annotation'],
                                             "status": "complete", "scheduled": None, "date": data['date']}})

    return Response(status=200, content_type='application/json')

if __name__ == '__main__':
    app.run(debug=True)
