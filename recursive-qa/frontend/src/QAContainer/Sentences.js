import QAButton from "./QAButton";
import {Card} from 'react-bootstrap';
import QACard from "./QACard";

export default function Sentences(props) {
    const sentence = props.sentence;
    const segments = props.segments;
    const currentSegment = segments !== undefined && segments.length > 0 ? segments[0]['segment'] : "";
    return <div className='qacomponent'>

        {/*<h1>Original Sentence</h1>*/}
        {/*<QACard text={sentence}/>*/}
        {/*<br/>*/}
        {/*<br/>*/}
        <h2>Current Segment</h2>
        <QACard text={currentSegment}/>


    </div>;
}