import json


def serialize_records(records):
    records = list(records)
    for i in range(len(records)):
        print(records[i])
        records[i]['id'] = str(records[i]['_id'])
        records[i]['sentenceId'] = str(records[i]['sentenceId'])
        del records[i]['_id']
    print(records)
    return json.dumps({'records': records})

