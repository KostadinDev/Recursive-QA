import * as React from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../constants'

export default function RemoveButton(props) {
    const handleRemove = async () => {
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({records: props.selectionModel})
        };
        await fetch(api + 'remove', options)
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
                color="error"
                onClick={handleRemove}
            >
                <DeleteIcon sx={{width: 20, mr: 1}}/>
                <div className="">Remove</div>
            </Button>
        </div>
    );
}