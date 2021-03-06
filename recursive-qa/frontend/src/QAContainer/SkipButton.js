import * as React from 'react';
import PublishIcon from '@mui/icons-material/Publish';
import Button from '@mui/material/Button';
import SkipNext from '@mui/icons-material/SkipNext';
import {useState} from "react";
import {isMobile} from "react-device-detect";

export default function SkipButton(props) {
    return (
        <div className="medium-opacity options-item">
            <Button
                variant="outlined"
                component="label"
                color="warning"
                onClick={props.skipRecord}
            >
                <SkipNext sx={{width: 20, mr: 1}}/>
                <div className="">{!isMobile?"Skip Sentence":""}</div>
            </Button>
        </div>
    );
}