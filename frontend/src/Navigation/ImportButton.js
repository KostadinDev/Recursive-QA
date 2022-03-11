import * as React from 'react';
import PublishIcon from '@mui/icons-material/Publish';
import Button from '@mui/material/Button';
import {useState} from "react";

export default function ImportButton() {
    const [file, setFile] = useState()
    const onFileChange = event => {

        // Update the state
        setFile(event.target.files[0]);
        console.log(event.target.files[0])
    };

    return (
        <div className="medium-opacity options-item">
            <Button
                variant="contained"
                component="label"
            >
                <PublishIcon sx={{width: 20, mr: 1}}/>
                <div className="">Import Sentences</div>
                <input
                    type="file"
                    hidden
                    onChange={onFileChange}
                />
            </Button>
        </div>
    );
}