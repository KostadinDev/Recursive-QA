import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function SubmitButton(props) {
    return (
        <Box sx={{'& button': {m: 1}}}>
            <Button variant="outlined" size="large" onClick={props.submitRecord}>
                Next Sentence
            </Button>
        </Box>
    );
}