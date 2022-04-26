import * as React from 'react';
import Launch from '@mui/icons-material/Launch';
import Button from '@mui/material/Button';
import {useState} from "react";

export default function ViewButton(props) {
    return (
        <div className="medium-opacity options-item">
            <Button
                variant="outlined"
                component="label"
                onClick={props.computeTreeData}
            >
                <Launch sx={{width: 20, mr: 1}}/>
                <div className="">View</div>
            </Button>
        </div>
    );
}