import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function NextButton() {
    return (
        <Box sx={{'& button': {m: 1}}}>
            <Button variant="outlined" size="large">
                Skip
            </Button>
        </Box>
    );
}