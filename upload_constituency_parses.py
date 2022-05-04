import sys
import benepar
from pymongo import MongoClient
import spacy

benepar.download('benepar_en3')
nlp = spacy.load('en_core_web_sm')
nlp.add_pipe('benepar', config={'model': 'benepar_en3'})
cluster = "mongodb+srv://kostadindev:k8k9gVsmdtAzpdLp@cluster0.p3nsf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"  # cloud
client = MongoClient(cluster)
db = client.RecursiveQA

if __name__ == "__main__":
    filename = sys.argv[1]
    if len(sys.argv) > 2:
        tag = sys.argv[2]
    else:
        tag = None
    with open(filename, 'r') as file:
        lines = file.readlines()

    for line in lines:
        document = {"sentence": line, "constituents": {}}
        if tag:
            document['tag'] = tag
        sent = list(nlp(line).sents)[0]
        for span in sent._.constituents:
            if span._.labels:
                document["constituents"][str(span)] = {"label": str(span._.labels[0])}
                if span._.children:
                    document["constituents"][str(span)]["children"] = [str(child) for child in list(span._.children)]
        if not db.constituents.find_one({'sentence': document['sentence']}):
            db.constituents.insert_one(document)
