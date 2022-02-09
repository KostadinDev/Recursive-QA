import {PlusSquare} from 'react-bootstrap-icons';
import './qacontainer.style.css';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import {purple} from '@mui/material/colors';
import {styled} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function QAItems(props) {
    const items = props.items;
    const selectedItem = props.selectedItem;
    const type = props.type;

    function formatText(text) {
        return text && type === 'question' ? <>What &nbsp;<i>{text.toLowerCase()}</i>?</> : <>{text.toLowerCase()}</>;
    }

    const QAButton = styled(Button)(({theme}) => ({
        width: "100%",
        textTransform: 'none',
        font: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: "rgba(0,0,0,0)",
        '&:hover': {
            backgroundColor: "rgba(102, 178, 255, 0.25)",
        }
    }));

    const QAButtonSelected = styled(Button)(({theme}) => ({
        width: "100%",
        textTransform: 'none',
        font: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: "rgba(102, 178, 255, 0.25)"
    }));
    return <div className='qacomponent'>
        <h3>Questions</h3>
        <Box
            sx={{
                display: 'flex',
                '& > *': {
                    m: 1,
                },
            }}
        >
            <ButtonGroup
                orientation="vertical"
                aria-label="vertical contained button group"
                variant="text"
                className='qacomponent'
            >
                {
                    items ? items.map(function (item) {

                        return item !== selectedItem ?
                            <QAButton className="qa-button selected-qa-button" onClick={() => {
                                props.handleSelect(item);
                            }}>
                                {formatText(item)}
                            </QAButton> : <QAButtonSelected className="qa-button selected-qa-button" onClick={() => {
                                props.handleSelect(item);
                            }}>
                                {formatText(item)}
                            </QAButtonSelected>
                    }) : ""
                }
            </ButtonGroup>
        </Box>
        <div><IconButton color="primary" aria-label="add to shopping cart">
            <AddCircleOutlineIcon/>
        </IconButton></div>

    </div>;
}