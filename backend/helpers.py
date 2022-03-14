import json


def serialize_records(records):
    records = list(records)
    for i in range(len(records)):
        print(records[i])
        records[i]['id'] = str(records[i]['_id'])
        del records[i]['_id']
    return json.dumps({'records': records})

