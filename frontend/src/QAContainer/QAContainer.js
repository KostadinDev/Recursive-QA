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

function QAContainer(props) {
    const [sentence, setSentence] = useState("");
    const [segments, setSegments] = useState([]);
    const [questions, setQuestions] = useState([]);
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
        await fetch(`${api}/questions?segment=${currentSegments[0]['segment']}`).then(res => res.json()).then((result) => {
            currentQuestions = result['question'];
        }, (error) => {
            //TODO handle in case of segment retrieval error
        });
        setSentence(currentSentence);
        setSegments(currentSegments);
        setQuestions(currentQuestions);
    };

    useEffect(() => {
        mount();
    }, []);

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
        });
    };

    function updateQuestions(newSegments) {
        fetch(`${api}/questions?segment=${newSegments[0]['segment']}`).then(res => res.json()).then((result) => {
            setQuestions(result['question']);
        }, (error) => {
            //TODO handle in case of segment retrieval error
        });
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

    function handleClick() {
        // console.log(props.history);
        let segmentsCopy = segments;
        if (segmentsCopy.length >= 2) {
            segmentsCopy.shift();
            segmentsCopy.shift();
        }
        setSegments(segmentsCopy);
        setQuestions([]);
        setAnswers([]);
        updateQuestions(segmentsCopy);
    }

    return (<div className="outside-qacontainer">
            <div className='qasentence'>
                <QACard sentence={sentence} segment={currentSegment}/>
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
            <div className='next-button'>
                <NextButton handleClick={handleClick}/>
            </div>
            <hr/>
        </div>
    );
}


export default QAContainer;
