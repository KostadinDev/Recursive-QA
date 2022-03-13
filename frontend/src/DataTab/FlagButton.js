import * as React from 'react';
import Flag from '@mui/icons-material/Flag';
import Button from '@mui/material/Button';
import {useState} from "react";

export default function FlagButton(props) {
    const handleFlag = async () => {

        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({records: props.selectionModel})
        };
        await fetch('http://localhost:5050/flag', options)
            .then(async response => {
                console.log(response.ok)
                if (!response.ok) {
                    // const error = (data && data.message) || response.status;
                    return Promise.reject(response.status);
                }
            }).catch(error => {
                alert("here?");
            });
        if (props.user) {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user: props.user})
            };
            fetch('http://localhost:5050/records', requestOptions)
                .then(async response => {
                    const isJson = response.headers.get('content-type')?.includes('application/json');
                    const data = isJson && await response.json();
                    if (!response.ok) {
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    }
                    console.log(data.records)
                    if (props.records != data.records) {
                        props.setRecords(data.records);
                    }
                })
                .catch(error => {
                    alert(error);
                });
        }
    }
    return (
        <div className="medium-opacity options-item">
            <Button
                variant="outlined"
                component="label"
                color="secondary"
                onClick = {handleFlag}
            >
                <Flag sx={{width: 20, mr: 1}}/>
                <div className="">Flag</div>
            </Button>
        </div>
    );
}