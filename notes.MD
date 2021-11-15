# Notes


## Completed
* Extracted annotated 23 sentences from SpecNFS 
* Perform constituency parse
* Extract NP, VP, SBAR, ADVP, etc in a dictionary (but keep tree structure pointers)
* Generate questions based on the "What {SBAR}?" format
* Generate answers using all (NP, VP) tuples
* Cluster answers based on edit distance similarity using affinitiy clustering
* If affinity clustering fails, use KMeans with k = max(sqrt(len(answers)), 5) (Kmeans seems to worse perform worse)
* Tried to filter out answers that appear in the question but that lowers recall for precision (answers being present in the suggested)
* Saved parses in parsed_sentences.csv in a dataframe containing [sentence, questions, answers, removed, phrases] columns
  * *removed* has the filtered answers
  * *phrases* has the collection of constituency structures (NP, VP, SVAR, etc)
    * the dataframe does not serialize parse trees so the structure is lost
* Added question answering from huggting face
* Added relation, span, and template enum types
* Recursively builds a tree where the edges are the relations and nodes are the spans
* Classfies spans and relations naively 
* Handles IF THEN ELSE sentences


## TODO
* Filter based on constituency tree structure (answers should be child nodes of a question)
* Introduce dependency parse
  * Use dependency parse to filter further?
  * Use dependency parse to extract annotation structure from (Q, A)
* Generate questions on the selected answer to confirm spans in the question?
* Use constants (regex), variables (already extracted), and keywords(returned, return
* 



## Problems
* How to pick template?
* How to label spans?
* How to label relations?