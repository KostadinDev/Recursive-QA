import * as React from 'react';
import Flag from '@mui/icons-material/Flag';
import Button from '@mui/material/Button';
import {useState} from "react";
import api from '../constants';
import {isMobile} from "react-device-detect";

export default function FlagButton(props) {
    const handleFlag = async () => {

        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({records: props.selectionModel})
        };
        await fetch(api + 'flag', options)
            .then(async response => {
                console.log(response.ok)
                if (!response.ok) {
                    return Promise.reject(response.status);
                }
            }).catch(error => {
                console.log(error);
            });
        if (props.user) {
            props.fetchRecords(props.user);
        }
    }
    return (
        <div className="medium-opacity options-item">
            <Button
                variant="outlined"
                component="label"
                color="secondary"
                onClick={handleFlag}
            >
                <Flag sx={{width: 20, mr: 1}}/>
                <div className="">{!isMobile?"Flag":""}</div>
            </Button>
        </div>
    );
}