import benepar, spacy
from transformers import pipeline
from .relation_types import Relation
from .span_types import Span
import numpy as np
import uuid
import os

benepar.download('benepar_en3')

from .rqa_templates import Template
from sklearn.cluster import AffinityPropagation, KMeans
import distance
import spacy
from spacy import displacy

nlp = spacy.load('en_core_web_sm')
nlp.add_pipe('benepar', config={'model': 'benepar_en3'})


def clearConsole():
    command = 'clear'
    if os.name in ('nt', 'dos'):  # If Machine is running on Windows, use cls
        command = 'cls'
    os.system(command)


class RQAParser:

    @staticmethod
    def get_answers(question, segment, template):
        answers = []
        answer_segment = segment.replace(question.strip(), "")
        phrases = RQAParser.get_phrases(segment, recursive=True)
        if template == 0 or template == 2:
            if 'NP' in phrases.keys():
                for np in phrases['NP']:
                    if str(np) in answer_segment:
                        answers.append(f'{np}')
        elif template == 1:
            if 'NP' in phrases.keys():
                for np in phrases['NP']:
                    if str(np) in answer_segment and 'VP' in phrases.keys():
                        for vp in phrases['VP']:
                            answers.append(f'{np} {vp}')
        print("answers before filter: ", answers, question)
        answers = RQAParser.filter_edit_distance(answers)
            # RQAParser.filter_not_in_question(answers, question))  # TODO make sure filtering doesnt hurt more than helps
        print("answers before filter: ", answers)
        return {'answers': answers}

    @staticmethod
    def get_questions(segment):
        phrases = RQAParser.get_phrases(segment, recursive=True)
        if 'SBAR' in phrases.keys():
            return {'questions': list(map(str, phrases["SBAR"]))}
        elif 'VP' in phrases.keys():
            return {'questions': list(map(str, phrases["VP"]))}

    @staticmethod
    def get_segments(sentence, template=0):
        phrases = RQAParser.get_phrases(sentence, recursive=False)
        segments = []
        if template == 0:  # Unknown template
            if 'S' in phrases.keys():
                if len(phrases['S']) == 1:
                    return RQAParser.get_segments(str(phrases['S'][0]), template)
                elif len(phrases['S']) == 2:
                    segments.extend(RQAParser.get_segments(str(phrases['S'][0]), 0))
                    segments.extend(RQAParser.get_segments(str(phrases['S'][1]), 0))
                    return segments
                else:
                    raise Exception(">2 sentences in first constituency parse not handled")
            elif 'SBAR' in phrases.keys():
                template = 1  # TEMPLATE IF_THEN
                return RQAParser.get_segments(sentence, template)
            elif 'ADVP' in phrases.keys():
                template = 2  # TEMPLATE THEN
                return RQAParser.get_segments(sentence, template)

        segments.append({'segment': sentence, 'template': template})
        return segments

    @staticmethod
    def build_dot(tree, dot):

        question, answer, relation = tree[0], tree[1], tree[2]

        if type(question) == dict:
            qid = str(uuid.uuid4())
            value = list(question.keys())[0] + ': ' + str(list(question.values())[0].value)
            dot.node(qid, value)
        else:
            qid, dot = RQAParser.build_dot(question, dot)

        if type(answer) == dict:
            aid = str(uuid.uuid4())
            value = list(answer.keys())[0] + ': ' + str(list(answer.values())[0].value)
            dot.node(aid, value)
        else:
            aid, dot = RQAParser.build_dot(answer, dot)

        dot.edge(qid, aid, str(relation.value))
        return qid, dot

    # @staticmethod
    # def visualize(tree):
    #     dot = graphviz.Graph()
    #     with dot.subgraph() as s:
    #         # s.attr(rank='same')
    #         _, s = RQAParser.build_dot(tree, s)
    #     dot.view()
    #
    #     return dot

    @staticmethod
    def filter_edit_distance(words):
        if len(words) == 0:
            return []
        filtered_words = []
        words = np.asarray(words)  # So that indexing with a list will work
        lev_similarity = -1 * np.array([[distance.levenshtein(w1, w2) for w1 in words] for w2 in words])
        try:
            clustering = AffinityPropagation(affinity="precomputed", damping=0.5)
            clustering.fit(lev_similarity)
            for cluster_id in np.unique(clustering.labels_):
                exemplar = words[clustering.cluster_centers_indices_[cluster_id]]
                filtered_words.append(str(exemplar))
        except:
            clustering = KMeans(n_clusters=max(int(np.sqrt(len(words))), 5), random_state=0).fit(lev_similarity)
            for cluster_id in np.unique(clustering.labels_):
                exemplar = np.random.choice(words[clustering.labels_ == cluster_id])
                filtered_words.append(exemplar)
        return filtered_words

    @staticmethod
    def filter_not_in_question(answers, question):
        filtered_answers = []
        for answer in answers:
            if answer not in question:
                filtered_answers.append(answer)
        return filtered_answers

    @staticmethod
    def get_phrases(sent, recursive=False):
        sent = list(nlp(sent).sents)[0]
        children = list(sent._.children)
        phrases = {}
        for i in range(len(children)):
            if str(children[i]) not in [',', ':', ';', '.', '!', '?']:
                try:
                    label = children[i]._.labels[0]
                except:
                    continue
                if label not in phrases.keys():
                    phrases[label] = []
                phrases[label].append(children[i])
                if recursive:
                    new_phrases = RQAParser.get_phrases(str(children[i]), recursive=recursive)
                    for key in new_phrases.keys():
                        if key not in phrases.keys():
                            phrases[key] = []
                        phrases[key].extend(new_phrases[key])
        return phrases

    @staticmethod
    def get_question(phrases):
        if 'SBAR' in phrases.keys():
            return f'{phrases["SBAR"][0]}'
        elif 'VP' in phrases.keys():
            return f'{phrases["VP"][0]}'

    @staticmethod
    def human_questions(phrases):
        if 'SBAR' in phrases.keys():
            return phrases["SBAR"]
        elif 'VP' in phrases.keys():
            return phrases["VP"]

    @staticmethod
    def get_answer(question, context, phrases, template, human=False):
        answers = []
        if template == Template.IF or template == Template.THEN:
            if 'NP' in phrases.keys():
                for np in phrases['NP']:
                    answers.append(f'{np}')
        elif template == Template.IF_THEN:
            if 'NP' in phrases.keys():
                for np in phrases['NP']:
                    if 'VP' in phrases.keys():
                        for vp in phrases['VP']:
                            answers.append(f'{np} {vp}')
        print("answers before filter: ", answers)
        answers = RQAParser.filter_edit_distance(
            RQAParser.filter_not_in_question(answers, question))  # TODO make sure filtering doesnt hurt more than helps
        print("answers after filter: ", answers)
        if human:
            return answers
        if len(answers) < 5 and answers:  # TODO CHANGE RANDOM MAGIC NUMBER
            if template == Template.IF:
                index = 0
            else:
                index = -1
            return answers[index]
        else:
            ans = pipeline("question-answering")
            ans = ans(question=question, context=context)
            return ans['answer']
        # return ans['answer'], answers

    @staticmethod
    def get_spans(sentence, original_sentence=None, template=Template.UNKNOWN, show_prints=False, human=True):
        spans = []

        print(
            '--------------------------------------------------------------------------------------') if show_prints else None
        print(f's: {sentence}') if show_prints else None
        if original_sentence == None:
            original_sentence = sentence
        if template == Template.UNKNOWN:
            phrases = RQAParser.get_phrases(sentence, recursive=False)
            if 'S' in phrases.keys():
                if len(phrases['S']) == 1:
                    return RQAParser.get_spans(str(phrases['S'][0]), original_sentence, template, show_prints)
                elif len(phrases['S']) == 2:
                    new_spans, question_span = RQAParser.get_spans(str(phrases['S'][0]), original_sentence,
                                                                   Template.UNKNOWN, show_prints)
                    spans.extend(new_spans)
                    new_spans, answer_span = RQAParser.get_spans(str(phrases['S'][1]), original_sentence, Template.THEN,
                                                                 show_prints)
                    spans.extend(new_spans)
                    relation = Relation.else_Clause
                    return spans, (question_span, answer_span, relation)
                else:
                    raise Exception(">2 sentences in first constituency parse not handled")
            elif 'SBAR' in phrases.keys():
                template = Template.IF_THEN
            return RQAParser.get_spans(sentence, original_sentence, template, show_prints)

        phrases = RQAParser.get_phrases(sentence, recursive=True)
        if not human:
            question_raw = RQAParser.get_question(phrases)
            question_proper = f"What {question_raw}?"
            answer = RQAParser.get_answer(question_proper, original_sentence, phrases, template)
            print(f'q: {question_proper}') if show_prints else None
            print(f"a: {answer}") if show_prints else None
        else:
            questions = RQAParser.human_questions(phrases)
            clearConsole()
            print(f'full s: {sentence}')
            print(f's: {sentence}') if show_prints else None
            print('-----------------------------------------------------------------')
            for idx, question in enumerate(questions):
                print(f"{idx}: What {str(question).lower()}?")
            print('-----------------------------------------------------------------')
            response = int(input('Select Question: '))
            question_raw = f'{questions[response]}'.lower()
            question_proper = f"What {question_raw}?"
            answers = RQAParser.get_answer(question_proper, original_sentence, phrases, template, human=human)
            clearConsole()
            print(f's: {sentence}') if show_prints else None
            print(f'q: {question_proper}') if show_prints else None
            print('-----------------------------------------------------------------')
            for idx, answer in enumerate(answers):
                print(f"{idx}: {answer}")
            print('-----------------------------------------------------------------')
            response = int(input('Pick Answer: '))
            answer = answers[response]

        if template == Template.IF_THEN:
            new_spans, question_span = RQAParser.get_spans(question_raw, original_sentence, Template.IF, show_prints)
            spans.extend(new_spans)
            new_spans, answer_span = RQAParser.get_spans(answer, original_sentence, Template.THEN, show_prints)
            spans.extend(new_spans)
            relation = Relation.then
        elif template == Template.IF:
            # if 'SBAR' in phrases.keys():
            #     return RQAParser.get_spans(question_raw, original_sentence, Template.IF_THEN, show_prints)
            if 'S' in phrases.keys():
                new_spans, (question_span, answer_span, relation) = RQAParser.get_spans(str(phrases['S'][0]),
                                                                                        original_sentence, template,
                                                                                        show_prints)
                spans.extend(new_spans)
            else:
                question_span = {question_raw: Span.Pred_Name}
                answer_span = {answer: Span.var_val}
                spans.append(question_span)
                spans.append(answer_span)
                relation = Relation.Argument

            if 'if' in sentence.lower():
                answer_span = (question_span, answer_span, relation)
                question_span = {'if': Span.if_else}
                relation = Relation.if_Clause
                spans.append('if')
        elif template == Template.THEN:
            question_span = {question_raw: Span.Def_Fun_name}
            answer_span = {answer: Span.Const}
            spans.append(question_span)
            spans.append(answer_span)
            relation = Relation.Return_val
        return spans, (question_span, answer_span, relation)
