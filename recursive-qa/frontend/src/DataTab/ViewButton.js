import * as React from 'react';
import Launch from '@mui/icons-material/Launch';
import Button from '@mui/material/Button';
import {useState} from "react";
import {isMobile} from "react-device-detect";

export default function ViewButton(props) {
    return (
        <div className={!isMobile?"medium-opacity options-item":""}>
            <Button
                variant="outlined"
                component="label"
                onClick={props.computeTreeData}
            >
                <Launch sx={{width: 20, mr: 1}}/>
                <div className="">{!isMobile?"View":""}</div>
            </Button>
        </div>
    );
}