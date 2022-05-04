import * as React from 'react';
import PublishIcon from '@mui/icons-material/Publish';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import {useState} from "react";
import {isMobile} from "react-device-detect";

export default function RemoveButton(props) {

    return (
        <div className="medium-opacity options-item">
            <Button
                variant="outlined"
                component="label"
                color="error"
                onClick={props.removeRecord}
            >
                <DeleteIcon sx={{width: 20, mr: 1}}/>
                <div className="">{!isMobile?"Remove":""}</div>
            </Button>
        </div>
    );
}