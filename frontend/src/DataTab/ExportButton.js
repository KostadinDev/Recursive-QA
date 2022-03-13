import * as React from 'react';
import FileDownload from '@mui/icons-material/FileDownload';
import Button from '@mui/material/Button';
import {useState} from "react";

export default function ExportButton(props) {
    return (
        <div className="medium-opacity options-item">
            <Button
                variant="outlined"
                component="label"
            >
                <FileDownload sx={{width: 20, mr: 1}}/>
                <div className="">Export</div>
            </Button>
        </div>
    );
}