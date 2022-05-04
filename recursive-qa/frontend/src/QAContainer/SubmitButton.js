import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {isMobile} from "react-device-detect";

export default function SubmitButton(props) {
    return (
        <Box sx={{'& button': {m: 1}}}>
            <Button variant="outlined" size="large" onClick={props.submitRecord}>
                <div className="">{!isMobile?"Next Sentence":"Next"}</div>
            </Button>
        </Box>
    );
}