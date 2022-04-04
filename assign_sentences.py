import sys
from pymongo import MongoClient

cluster = "mongodb+srv://kostadindev:k8k9gVsmdtAzpdLp@cluster0.p3nsf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"  # cloud
client = MongoClient(cluster)
db = client.RecursiveQA

if __name__ == "__main__":
    tag = sys.argv[1]
    users = sys.argv[2:]
    sentences = [x for x in db.constituents.find({"tag": tag})]
    records = []
    for sentence in sentences:
        for user in users:
            records.append(
                {"sentence": sentence['sentence'], "sentenceId": sentence["_id"], "user": user, 'status': 'incomplete',
                 'scheduled': True})

    db.records.insert_many(records)
    # db.records.delete_many({"user": "kostadin.devedzhiev@stonybrook.edu"})