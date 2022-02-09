import QAButton from "./QAButton";
import {PlusSquare} from "react-bootstrap-icons";
import {Button} from 'react-bootstrap';
import './qacontainer.style.css';

export default function Answers(props) {
    const answers = props.answers;
    const selectedAnswer = props.selectedAnswer;
    const handleSelectAnswer = props.handleSelectAnswer
    return <div className='qacomponent'><h3>Answers</h3>
        {answers ? answers.map(function (answer) {
            return <QAButton key={answer} text={answer} selected={selectedAnswer}
                             handleSelect={handleSelectAnswer}/>
        }) : ""}
        <div><PlusSquare size={30} className='add-button'/></div>
    </div>;
}