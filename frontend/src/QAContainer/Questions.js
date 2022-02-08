import QAButton from "./QAButton";
import {PlusSquare} from 'react-bootstrap-icons';
import './qacontainer.style.css';

export default function Questions(props) {
    const questions = props.questions;
    const selectedQuestion = props.selectedQuestion;

    function convertToQuestion(text){
        return text?`What ${text.toLowerCase()}?`:"";
    }
    return <div className='qacomponent'>
        <h2>Questions</h2>
        {
            questions ? questions.map(function (question) {

                return <QAButton key={question} text={question} selected={selectedQuestion}
                                 handleSelect={props.handleSelectQuestion} styleFunction={convertToQuestion}/>
            }) : ""
        }
        <div><PlusSquare size={30} className='add-button'/></div>

    </div>;
}