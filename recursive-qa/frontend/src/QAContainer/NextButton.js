import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {isMobile} from "react-device-detect";

export default function NextButton(props) {
    const handleClick = props.handleClick;
    return (
        <Box sx={{'& button': {m: 1}}}>
            <Button variant="outlined" size="large" onClick={() => {handleClick()}}>
                <div className="">{!isMobile?"Skip Sentence":"Skip"}</div>
            </Button>
        </Box>
    );
}