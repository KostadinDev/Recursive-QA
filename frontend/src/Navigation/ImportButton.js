import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import PublishIcon from '@mui/icons-material/Publish';

export default function ImportButton() {
    return (
        <div className="medium-opacity">
            <Box sx={{'& > :not(style)': {m: 1}}}>
                <Fab variant="extended" size="small" color="primary" aria-label="add">
                    <PublishIcon sx={{width: 20, mr: 1}}/>
                    <div className='import-text'>Import Sentences</div>
                </Fab>
            </Box>
        </div>
    );
}