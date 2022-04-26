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
