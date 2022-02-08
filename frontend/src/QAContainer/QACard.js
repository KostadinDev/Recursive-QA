import {Button} from 'react-bootstrap';

export default function QACard(props) {
    const text = props.text;
    return <div className='qabutton'>
        <div className="d-grid gap-4">
            <Button variant="secondary" size="lg" disabled>
                {text}
            </Button>
        </div>
    </div>;
}