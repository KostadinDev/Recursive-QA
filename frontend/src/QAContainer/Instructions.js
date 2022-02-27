import './qacontainer.style.css';
import Box from "@mui/material/Box";
import Highlighter from "react-highlight-words";
import * as React from "react";

export default function Instructions(props) {
    const turnedOn = props.turnedOn;
    const type = props.type;
    const text = props.type=='questions'?"Select the most appropriate question given the highlighted segment or create your own.":"Select the most appropriate answer given the selected question or create your own."
    return <div className='instructions'>
        {turnedOn?        <Box
            sx={{
                p:1,
                width: '100%',
                border: '1px solid grey', borderRadius: '5px', borderColor:'#5090D3'
            }}>
            <>Instructions</>
            <hr/>
            <>{text}</>
        </Box>:<></>}


    </div>;
}