import {Button} from 'react-bootstrap';

export default function QAButton(props) {
    const text = props.text;
    const type = props.type;
    const handleSelect = props.handleSelect;
    const selected = props.selected;
    const variant = text == selected ? 'success' : 'secondary';
    const styleFunction = props.styleFunction ? props.styleFunction : function (text) {
        return text;
    };
    return <div className='qabutton'>
        <div className="d-grid gap-4">
            <Button variant={variant} size="lg" onClick={() => {
                handleSelect(text);
            }}>
                {styleFunction(text)}
            </Button>
        </div>
    </div>;
}