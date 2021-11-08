#%%

import benepar, spacy
benepar.download('benepar_en3')

nlp = spacy.load('en_core_web_sm')
nlp.add_pipe('benepar', config={'model': 'benepar_en3'})
doc = nlp('The time for action is now. It is never too late to do something.')
sent = list(doc.sents)[0]

#%%

#list(sent._.children)[3]
#print(list(sent._.children)[2].label)
# for i in range(len(list(sent._.children))):
#     print(list(sent._.children[i]), list(sent._._labels)[i])
# list(sent._.children)
import pandas as pd
from pprint import pprint as pprint
import numpy as np
from sklearn.cluster import AffinityPropagation, KMeans
import distance
sentences = pd.read_csv("sentences.csv")
sentences = sentences.to_numpy().squeeze()
signs = [',', ':', ';', '.', '!', '?']
recursive = True
max_similarity= 5

#%%

def pd_print_entry(df, index):
    entry = df.iloc[index]
    print("Sentence: ")
    print(entry['sentence'])
    print("Questions: ")
    print(entry['questions'])
    print('Answers')
    print(entry['answers'])
    # for answer in entry['answers']:
    #     print(answer)
    print('Removed')
    print(entry['removed'])
    # for removed in entry['removed']:
    #     print(removed)
    print('Phrases: ')
    pprint(entry['phrases'])

#%%

def get_phrases(sent, recursive = False):
    children = list(sent._.children)
    #VP, NP, SBAR, ADVP, PP = [], [], [], [], []
    phrases = {}
    for i in range(len(children)):
        if str(children[i]) not in signs:
            try:
                label = children[i]._.labels[0]
            except:
                label= "stop"
            # print(children[i], label)
            # print(children[i], children[i]._.labels)
            # generate_questions(children[i])
            if label != 'stop':
                if label not in phrases.keys():
                    phrases[label] = []
                phrases[label].append(children[i])
                new_phrases= get_phrases(children[i], recursive= recursive)
                for key in new_phrases.keys():
                    if key not in phrases.keys():
                        phrases[key] = []
                    phrases[key].extend(new_phrases[key])
    return phrases

#%%

def get_QA(phrases):
    questions, answers = [], []
    if 'SBAR' in phrases.keys():
        for sbar in phrases['SBAR']:
            questions.append(f"What {str(sbar)}?")
            if 'NP' in phrases.keys():
                for np in phrases['NP']:
                    if 'VP' in phrases.keys():
                        for vp in phrases['VP']:
                            answers.append(f'<np>{np}<np> <vp>{vp}<vp>')
    return questions, answers

#%%

def edit_distance(s1, s2):
    if len(s1) > len(s2):
        s1, s2 = s2, s1

    distances = range(len(s1) + 1)
    for i2, c2 in enumerate(s2):
        distances_ = [i2+1]
        for i1, c1 in enumerate(s1):
            if c1 == c2:
                distances_.append(distances[i1])
            else:
                distances_.append(1 + min((distances[i1], distances[i1 + 1], distances_[-1])))
        distances = distances_
    return distances[-1]

#%%
# TODO REVISIT USING TREE
def filter_edit_distance(words):
    if len(words) == 0:
        return []
    filtered_words = []
    words = np.asarray(words) #So that indexing with a list will work
    lev_similarity = -1*np.array([[distance.levenshtein(w1,w2) for w1 in words] for w2 in words])
    print(lev_similarity)
    try:
        clustering = AffinityPropagation(affinity="precomputed", damping=0.5)
        clustering.fit(lev_similarity)
        for cluster_id in np.unique(clustering.labels_):
            exemplar = words[clustering.cluster_centers_indices_[cluster_id]]
            filtered_words.append(exemplar)
    except:
        clustering = KMeans(n_clusters=max(int(np.sqrt(len(words))),5), random_state=0).fit(lev_similarity)
        for cluster_id in np.unique(clustering.labels_):
            exemplar = np.random.choice(words[clustering.labels_==cluster_id])
            filtered_words.append(exemplar)
    return filtered_words

#%%

def filter_not_in_question(answers, question):
    filtered_answers = []
    for answer in answers:
        vp = answer.split('<vp>')[1]
        np = answer.split('<np>')[1]
        if (vp not in question or len(vp)<10) and (np not in question or len(np)<10):
            filtered_answers.append(answer)
    return filtered_answers

#%%

def parse_sentence(sentence):
    sent = list(nlp(sentence).sents)[0]
    phrases = get_phrases(sent, recursive = recursive)
    questions, answers = get_QA(phrases)
    qa_pairs = []
    filtered_answers = filter_edit_distance(answers)
    # for question in questions:
    #     filtered_answers = answers #filter_not_in_question(answers, question)
    #     qa_pairs.append({'question':question, 'answers':filtered_answers})
    return [str(sent), questions, filtered_answers, [answer for answer in answers if answer not in filtered_answers], phrases]

#%%

if __name__ == '__main__':
    entries = []
    for idx, sentence in enumerate(sentences):
        entries.append(parse_sentence(sentence))
        print(f"Finished {idx}/{len(sentences)-1}")
    df = pd.DataFrame(entries, columns =['sentence', 'questions', 'answers','removed', 'phrases'])
    df.to_csv('parsed_sentences.csv')