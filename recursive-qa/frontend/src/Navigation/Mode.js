import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {useState} from 'react';
import {isMobile} from "react-device-detect";

function Mode(props) {


    const handleAlignment = (event, newMode) => {
        if (newMode !== null) {
            // console.log("hello", props.records, props.setScheduled)
            // props.setScheduled(props.records.filter((record) => "scheduled" in record && record['scheduled'] === true));
            props.setMode(newMode);
            localStorage.setItem('mode', newMode);
        }
    };

    return (
        <div className={!isMobile?"options-item":""}>
            <Stack direction="row" spacing={4}>
                <ToggleButtonGroup
                    value={props.mode}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment"
                    color={"primary"}
                    size = 'small'

                >
                    <ToggleButton value="tool" aria-label="left aligned"
                                  sx={{color: "white", textTransform: "unset", fontSize:16}}>
                        <>Tool</>
                    </ToggleButton>
                    <ToggleButton value="data" aria-label="centered" sx={{color: "white", textTransform: "unset", fontSize:16}}>
                        <>Data</>
                    </ToggleButton>
                </ToggleButtonGroup>

            </Stack>
        </div>
    );
}

export default Mode;
