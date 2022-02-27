import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function NextButton(props) {
    const handleClick = props.handleClick;
    return (
        <Box sx={{'& button': {m: 1}}}>
            <Button variant="outlined" size="large" onClick={() => {handleClick()}}>
                Skip
            </Button>
        </Box>
    );
}