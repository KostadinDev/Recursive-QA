import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {useState} from 'react';

function Mode(props) {


    const handleAlignment = (event, newMode) => {
        if (newMode !== null) {
            props.setMode(newMode);
        }
    };

    return (
        <div className="options-item">
            <Stack direction="row" spacing={4}>
                <ToggleButtonGroup
                    value={props.mode}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment"
                    color={"primary"}
                    size = 'small'

                >
                    <ToggleButton value="data" aria-label="left aligned"
                                  sx={{color: "white", textTransform: "unset", fontSize:16}}>
                        <>Data</>
                    </ToggleButton>
                    <ToggleButton value="tool" aria-label="centered" sx={{color: "white", textTransform: "unset", fontSize:16}}>
                        <>Tool</>
                    </ToggleButton>
                </ToggleButtonGroup>

            </Stack>
        </div>
    );
}

export default Mode;
