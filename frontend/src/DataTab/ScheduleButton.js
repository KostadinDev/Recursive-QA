import * as React from 'react';
import Button from '@mui/material/Button';
import Schedule from '@mui/icons-material/Schedule';
import {useState} from "react";

export default function ScheduleButton(props) {

    const handleSchedule = async () => {

        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({records: props.selectionModel})
        };
        await fetch('http://localhost:5050/schedule', options)
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
                variant="outlined" a
                component="label"
                onClick={handleSchedule}
                sx={{border: "0.5px solid rgb(245, 124, 0)", "&:hover": {borderColor: "rgb(255, 167, 38)"}}}
            >
                <Schedule sx={{width: 20, mr: 1, color: "rgb(245, 124, 0)"}}/>
                <div style={{color: "rgb(245, 124, 0)"}}>Schedule</div>
            </Button>
        </div>
    );
}