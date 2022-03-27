from flask import Flask, send_from_directory, request, Response
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS  # comment this on deployment
from spec_rqa.rqa_parser import RQAParser
from pymongo import MongoClient
from helpers import serialize_records
import json
from bson.objectid import ObjectId

print(RQAParser.get_phrases(
    "If the current filehandle is a named attribute directory, OPEN will then create or open a named attribute file."
))
