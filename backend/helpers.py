import json


def serialize_records(records):
    records = list(records)
    for record in records:
        record['__id'] = str(records['__id'])
    return json.dumps({'records': records})
