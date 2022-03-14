import React, {useState, useEffect, useReducer} from 'react';
import QAItems from "./QAItems";
import QACard from "./QACard";
import './qacontainer.style.css';
import NextButton from "./NextButton";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Instructions from "./Instructions";
import SubmitButton from "./SubmitButton";
import FlagButton from "./FlagButton";
import RemoveButton from "./RemoveButton";
import SkipButton from "./SkipButton";

class Segment {
    constructor(text, startingIndex, parent) {
        this.text = text;
        this.type = null;
        this.children = [];
        this.childrenRelations = [];
        this.startingIndex = startingIndex;
        this.endingIndex = startingIndex + text.length;
        this.parent = parent;
    }
}

class Relation {
    constructor(qnode, anode, type) {
        this.qnode = qnode;
        this.anode = anode;
        this.type = type;
    }
}

class TreeIterator {
    constructor(root) {
        this.root = root;
        this.current = root;
        this.ordering = [root];
    }

    get next() {
        return this.ordering.shift();
    }

    insert(children) {
        this.ordering = children.concat(this.ordering);
    }
}


function QAContainer(props) {
    const [currentRecord, setCurrentRecord] = useState(props.scheduled ? props.scheduled[0] : null);
    const [segments, setSegments] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [tree, setTree] = useState();


    const [sentence, setSentence] = useState("");
    // const [segments, setSegments] = useState([]);
    // const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [annotation, setAnnotation] = useState([]);

    let history = props.history;
    let setHistory = props.setHistory;
    const instructions = props.instructions;

    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    const currentSegment = segments !== undefined && segments.length > 0 ? segments[0]['segment'] : "";
    const api = "http://localhost:5050";

    const mount = async () => {
        let currentSentence = '';
        let currentSegments = [];
        let currentQuestions = [];
        await fetch(`${api}/sentence`).then(res => res.json()).then((result) => {
            currentSentence = result['sentence'];
        }, (error) => {
            //TODO handle in case of sentence retrieval error
        });
        await fetch(`${api}/segments?sentence=${currentSentence}`).then(res => res.json()).then((result) => {
            currentSegments = result;
        }, (error) => {
            //TODO handle in case of segment retrieval error
        });
        await fetch(`${api}/questions?segment=${currentSegments[0]['segment']}`).then(res => res.json())
            .then((result) => {
                currentQuestions = result['question'];
            }, (error) => {
                //TODO handle in case of segment retrieval error
            });
        setSentence(currentSentence);
        setSegments(currentSegments);
        setQuestions(currentQuestions);
    };

    const submitRecord = async () => {

        if (props.scheduled && props.scheduled[0]) {
            const d = new Date();
            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    history: props.history,
                    // rapid: props.mode,
                    record: props.scheduled[0].id,
                    date: d.getTime()
                })
            };
            await fetch('http://localhost:5050/submit', options)
                .then(async response => {
                    console.log(response.ok)
                    if (!response.ok) {
                        // const error = (data && data.message) || response.status;
                        return Promise.reject(response.status);
                    }
                }).catch(error => {
                    alert(error);
                });
            if (props.user) {
                await props.fetchRecords(props.user);
                props.scheduled.shift();
                props.setScheduled(props.scheduled);
                await onMount();
            }
        }

    }
    const removeRecord = async () => {
        if (props.scheduled && props.scheduled[0]) {
            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({records: [props.scheduled[0].id]})
            };
            await fetch('http://localhost:5050/remove', options)
                .then(async response => {
                    console.log(response.ok)
                    if (!response.ok) {
                        // const error = (data && data.message) || response.status;
                        return Promise.reject(response.status);
                    }
                }).catch(error => {
                    alert(error);
                });
            if (props.user) {
                await props.fetchRecords(props.user);
                props.scheduled.shift();
                props.setScheduled(props.scheduled);
                await onMount();
            }
        }
    }
    const skipRecord = async () => {

        if (props.scheduled && props.scheduled[0]) {
            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({record: props.scheduled[0].id})
            };
            await fetch('http://localhost:5050/skip', options)
                .then(async response => {
                    console.log(response.ok)
                    if (!response.ok) {
                        // const error = (data && data.message) || response.status;
                        return Promise.reject(response.status);
                    }
                }).catch(error => {
                    alert("here?");
                });
            if (props.user) {
                await props.fetchRecords(props.user);
                props.scheduled.shift();
                props.setScheduled(props.scheduled);
                await onMount();
            }
        }
    }

    function updateSegments(question, answer) {
        fetch(`${api}/segments?sentence=${question}`).then(res => res.json()).then((result) => {
            return result;
        }, (error) => {
            //TODO handle in case of segment retrieval error
        }).then((newSegments) =>
            fetch(`${api}/segments?sentence=${answer}`).then(res => res.json()).then((result) => {
                newSegments = newSegments.concat(result);
                let segmentsCopy = segments;
                segmentsCopy.shift();
                newSegments = newSegments.concat(segmentsCopy);
                setSegments(newSegments);
                return newSegments;
            }, (error) => {
                //TODO handle in case of segment retrieval error
            })
        ).then((newSegments) => {
            setHistory([{'question': question, 'answer': answer, 'segment': currentSegment}].concat(history))
            setQuestions([]);
            setAnswers([]);
            return newSegments
        }).then((newSegments) => {
            updateQuestions(newSegments);
            console.log("we get here??", newSegments.length);
            if (newSegments.length == 0) {
                console.log("we dont get here mate?");
                submitRecord()
            }
        });
    };

    function updateQuestions(newSegments) {
        if (newSegments.length) {
            fetch(`${api}/questions?segment=${newSegments[0]['segment']}`).then(res => res.json()).then((result) => {
                if (result) {
                    setQuestions(result['questions']);
                }
            }, (error) => {
                //TODO handle in case of segment retrieval error
            });
        }
    }

    function handleSelectQuestion(chosenQuestion) {
        setSelectedQuestion(chosenQuestion);
        fetch(`${api}/answers?segment=${segments[0]['segment']}&question=${chosenQuestion}
        &template=${segments[0]['template']}`).then(res => res.json()).then((result) => {
            setAnswers(result['answers']);
        }, (error) => {
            //TODO handle in case of answer retrieval error
        })
    }

    function handleSelectAnswer(chosenAnswer) {
        setSelectedAnswer(chosenAnswer);
        addAnnotation(selectedQuestion, chosenAnswer);
        updateSegments(selectedQuestion, chosenAnswer);

    }

    function getRelation(question, answer) {
        // TODO Implelement this
        return null;
    }

    function addAnnotation(question, answer) {
        // TODO TEST THIS
        const relation = getRelation(question, answer);
        setAnnotation(annotation.concat([[question, answer, relation]]));
    }

    function continueRecord() {
        // console.log(props.history);
        if (segments) {
            let segmentsCopy = segments;
            if (segmentsCopy.length >= 2) {
                segmentsCopy.shift();
                segmentsCopy.shift();
            } else if (segmentsCopy.length >= 1) {
                segmentsCopy.shift();
            }
            setSegments(segmentsCopy);
            setQuestions([]);
            setAnswers([]);
            updateQuestions(segmentsCopy);
        }
    }

    const onMount = async () => {

        setQuestions([]);
        setSegments([]);
        setAnswers([]);
        props.setHistory([])
        if (props.scheduled && props.scheduled[0]) {
            console.log("mounting again")
            let newSegments, newQuestions;
            await fetch(`${api}/segments?sentence=${props.scheduled[0].sentence}`).then(res => res.json()).then((result) => {
                newSegments = result;
                console.log("new segments: ", newSegments, props.scheduled[0].sentence)
            }, (error) => {
                //TODO handle in case of segment retrieval error
            });
            await fetch(`${api}/questions?segment=${newSegments[0]['segment']}`).then(res => res.json()).then((result) => {
                newQuestions = result['questions'];
                console.log(result['questions'], "Q")

            }, (error) => {
                //TODO handle in case of segment retrieval error
            });

            setSegments(newSegments);
            setQuestions(newQuestions);

        }
    }
    useEffect(() => {
        //mount();
        onMount().catch();

    }, []);


    return (<div className="outside-qacontainer">
            <div className='qasentence'>
                {
                    props.scheduled && props.scheduled[0] ?

                        <QACard scheduled={props.scheduled} sentence={props.scheduled[0]['sentence']}
                                segment={currentSegment}/> : ""
                }
            </div>
            <hr/>
            <div className='qacontainer'>
                <Instructions turnedOn={instructions} type='questions'/>
                <QAItems items={questions} setItems={setQuestions} selectedItem={selectedQuestion}
                         handleSelect={handleSelectQuestion} type={"Questions"}/>
                <QAItems items={answers} setItems={setAnswers} selectedItem={selectedAnswer}
                         handleSelect={handleSelectAnswer} type={"Answers"}/>
                <Instructions turnedOn={instructions} type='answers'/>
            </div>
            <div className={"qa-button-container"}>
                <div className='qa-buttons'>
                    <div className="qa-button-group">
                        <NextButton handleClick={continueRecord}/>
                        <SubmitButton submitRecord={submitRecord}/>
                    </div>
                    <div className="qa-button-group">
                        <SkipButton skipRecord={skipRecord}/>
                        <FlagButton scheduled={props.scheduled} fetchRecords={props.fetchRecords} user={props.user}/>
                        <RemoveButton removeRecord={removeRecord}/>
                    </div>
                </div>
            </div>
            <hr/>
        </div>
    );
}


export default QAContainer;
