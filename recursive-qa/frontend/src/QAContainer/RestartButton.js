import * as React from 'react';
import PublishIcon from '@mui/icons-material/Publish';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import {useState} from "react";
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function RestartButton(props) {

    return (
        <div className="medium-opacity options-item">
            <Button
                variant="outlined"
                component="label"
                color="success"
                onClick={props.handleRestart}
            >
                <RestartAltIcon sx={{width: 20, mr: 1}}/>
                <div className="">Restart</div>
            </Button>
        </div>
    );
}