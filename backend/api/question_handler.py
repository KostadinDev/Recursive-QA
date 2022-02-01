from flask_restful import Api, Resource, reqparse
from spec_rqa.rqa_parser import RQAParser


class QuestionHandler(Resource):
    def __init__(self, dog):
        print(dog)

    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('sentence', type=str)
        parser.add_argument('segment', type=str)
        sentence, segment = parser.parse_args()['sentence'], parser.parse_args()['segment']
        segment = 'If it is a directory, NFS4ERR_ISDIR is returned; otherwise, NFS4ERR_SYMLINK is returned.'
        questions = RQAParser.get_questions(segment)

        return str(questions)

    def post(self):
        print(self)
        parser = reqparse.RequestParser()
        parser.add_argument('type', type=str)
        parser.add_argument('message', type=str)

        args = parser.parse_args()

        print(args)
        # note, the post req from frontend needs to match the strings here (e.g. 'type and 'message')

        request_type = args['type']
        request_json = args['message']
        # ret_status, ret_msg = ReturnData(request_type, request_json)
        # currently just returning the req straight
        ret_status = request_type
        ret_msg = request_json

        if ret_msg:
            message = "Your Message Requested: {}".format(ret_msg)
        else:
            message = "No Msg"

        final_ret = {"status": "Success", "message": message}

        return final_ret
