from pymongo import MongoClient
import json
from bson.objectid import ObjectId

cluster = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
client = MongoClient(cluster)

print(client.list_database_names())

db = client.RecursiveQA
print(db.list_collection_names())
