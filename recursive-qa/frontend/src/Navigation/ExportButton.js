import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import FileDownload from '@mui/icons-material/FileDownload';

export default function ExportButton() {
    return (
        <div className="medium-opacity">
            <Box sx={{'& > :not(style)': {m: 1}}}>
                <Fab variant="extended" size="small" color="secondary" aria-label="add">
                    <FileDownload sx={{width: 20, mr: 1}}/>
                    <div className='import-text'>Export Annotations</div>
                </Fab>
            </Box>
        </div>
    );
}