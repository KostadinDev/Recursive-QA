import * as React from 'react';
import PublishIcon from '@mui/icons-material/Publish';
import Button from '@mui/material/Button';
import {useState} from "react";
import api from "../constants";
import {isMobile} from "react-device-detect";

export default function ImportButton(props) {
    const [file, setFile] = useState()
    let sentences = null;
    const onFileChange = async event => {
        setFile(event.target.files[0]);
        uploadFile(event.target.files[0]);
    };


    function parseText(loadedFile) {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = (event) => {
                let text = event.target.result;
                sentences = text.split('\n');
                console.log(sentences);
                resolve(sentences);
            };
            reader.readAsText(loadedFile);
        });
    }

    async function uploadFile(loadedFile) {
        await parseText(loadedFile);
        if (props.user) {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user: props.user, sentences: sentences})
            };
            await fetch(api + "upload", requestOptions)
                .then(async response => {
                    const isJson = response.headers.get('content-type')?.includes('application/json');
                    const data = isJson && await response.json();
                    if (!response.ok) {
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    }
                })
                .catch(error => {
                    console.error('error: ', error);
                });
            props.fetchRecords(props.user);
        } else {
            alert("Please log in before uploading data.");
        }

    }

    return (
        <div className="medium-opacity options-item">
            <Button
                variant="outlined"
                component="label">
                <PublishIcon sx={{width: 20, mr: 1}}/>
                <div>{!isMobile?"Import":""}</div>
                <input
                    type="file"
                    hidden
                    onChange={onFileChange}/>
            </Button>
        </div>
    );
}