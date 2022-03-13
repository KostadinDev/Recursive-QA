import * as React from 'react';
import PublishIcon from '@mui/icons-material/Publish';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import {useState} from "react";

export default function RemoveButton(props) {
    const handleRemove = async () => {

        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({records: props.selectionModel})
        };
        await fetch('http://localhost:5050/remove', options)
            .then(async response => {
                console.log(response.ok)
                if (!response.ok) {
                    // const error = (data && data.message) || response.status;
                    return Promise.reject(response.status);
                }
            }).catch(error => {
                alert(error);
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
                color="error"
                onClick={handleRemove}
            >
                <DeleteIcon sx={{width: 20, mr: 1}}/>
                <div className="">Remove</div>
            </Button>
        </div>
    );
}