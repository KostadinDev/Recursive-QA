import {PlusSquare} from 'react-bootstrap-icons';
import {useState} from 'react';
import './qacontainer.style.css';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import {purple} from '@mui/material/colors';
import {styled} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddTaskIcon from '@mui/icons-material/AddTask';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TextField from '@mui/material/TextField';
import {makeStyles} from "@material-ui/core/styles";

export default function QAItems(props) {
    const items = props.items;
    const setItems = props.setItems;
    const selectedItem = props.selectedItem;
    const type = props.type;
    const [addNewItem, setAddNewItem] = useState(false)
    const [newItem, setNewItem] = useState('');
    const handleChange = (event) => {
        setNewItem(event.target.value);
    };

    const textInputStyle = makeStyles({
        border: '#e2e2e1',
        input: {
            borderBottom: '1px solid #e2e2e1',
            color: "white",
            borderColor: "white",
            textAlign: 'center',
        }
    });
    const classes = textInputStyle();

    function formatText(text) {
        const sbar = text.toLowerCase().includes("if ")?true:false;
        const question = sbar?"What happens ": "What "
        return text && type === 'Questions' ? <>{question}{text.toLowerCase()}?</> : <>{text}</>;
    }


    const addItem = (event) => {
        event.preventDefault();
        let newItemCopy = newItem.toLowerCase();
        const wordsInNewItem = newItemCopy.split(' ');
        if (wordsInNewItem[0].toLowerCase() == 'what') {
            newItemCopy = (newItemCopy.replace('what ', ''));
        }
        if (newItemCopy[newItemCopy.length - 1] == '?') {
            newItemCopy = (newItem.substr(0, newItem.length - 1));
        }
        setItems(items.concat([newItemCopy]))
        setNewItem("");
        setAddNewItem(false);
        return false;
    }
    const deleteAddItem = () => {
        setNewItem("");
        setAddNewItem(false);
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
    return <div className='qacomponent qa'>
        <h3>{type}</h3>
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
                            <QAButton key = {item} className="qa-button selected-qa-button" onClick={() => {
                                props.handleSelect(item);
                            }}>
                                {formatText(item)}
                            </QAButton> : <QAButtonSelected key = {item}  className="qa-button selected-qa-button" onClick={() => {
                                props.handleSelect(item);
                            }}>
                                {formatText(item)}
                            </QAButtonSelected>
                    }) : ""
                }
            </ButtonGroup>
        </Box>
        {addNewItem ? <div>
            <form className="text-input" onSubmit={addItem}>
                <TextField
                    inputProps={{className: classes.input}}
                    style={{flex: 1, margin: '0 20px 0 0', color: 'white'}}
                    className="text-input"
                    id="standard-basic"
                    variant="standard"
                    value={newItem}
                    onChange={handleChange}/>
                <div>
                    <IconButton color="primary" aria-label="add to shopping cart" onClick={() => {
                        addItem();
                    }} type='submit'>
                        <AddTaskIcon/>
                    </IconButton> <IconButton color="primary" aria-label="delete add item" onClick={() => {
                    deleteAddItem();
                }} type='submit'>
                    <DeleteOutlineIcon/>
                </IconButton>
                </div>
            </form>
        </div> : <div><IconButton color="primary" aria-label="add to shopping cart" onClick={() => {
            setAddNewItem(true)
        }}>
            <AddCircleOutlineIcon/>
        </IconButton></div>}


    </div>;
}