import benepar, spacy
import nltk

benepar.download('benepar_en3')

nlp = spacy.load('en_core_web_sm')
nlp.add_pipe('benepar', config={'model': 'benepar_en3'})
doc = nlp('The time for action is now. It is never too late to do something.')
sent = list(doc.sents)[0]
print(sent._.parse_string)
# (S (NP (NP (DT The) (NN time)) (PP (IN for) (NP (NN action)))) (VP (VBZ is) (ADVP (RB now))) (. .))
print(sent._.labels)
# ('S',)
print(list(sent._.children)[0])
# The time for action