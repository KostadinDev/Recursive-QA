import {Button} from 'react-bootstrap';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import {createTheme, ThemeProvider, styled} from '@mui/material/styles';
import Highlighter from 'react-highlight-words';
import './qacontainer.style.css'
import {Flag, SkipNext} from "@mui/icons-material";

const Item = styled(Paper)(({theme}) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 60,
    lineHeight: '60px',
}));

const darkTheme = createTheme({palette: {mode: 'dark'}});
const elevation = 6;


export default function QACard(props) {
    const sentence = props.sentence;
    const segment = props.segment
    return <div className='qabutton top-sentence'>
        {/*<Box*/}
        {/*    sx={{*/}
        {/*        p:4,*/}
        {/*        width: '100%',*/}
        {/*        border: '1px solid grey', borderRadius: '5px', borderColor:'#5090D3'*/}
        {/*    }}>*/}
        <br/>
        <Highlighter
            highlightClassName="highlight"
            searchWords={[segment]}
            autoEscape={true}
            textToHighlight={sentence}/>
        <div
            style={{marginLeft: "20px"}}>{props.scheduled && "flagged" in props.scheduled[0] && props.scheduled[0].flagged ?
            <Flag color={"secondary"}/> : ""}</div>
        <div
            style={{marginLeft: "20px"}}>{props.scheduled && "skipped" in props.scheduled[0] && props.scheduled[0].skipped ?
            <SkipNext color={"warning"}/> : ""}</div>
        <br/>
        {/*</Box>*/}
    </div>;
}