import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import {isMobile} from "react-device-detect";

export default function UserBadge(props) {
    const firstName = props.user.givenName;
    const profilePicture = props.user.imageUrl;
    const fullName = props.user.name;

    return (
        <div className={"options-item user-badge"}>
            <Stack direction="row" spacing={1}>
                <Chip sx={{color: "white", fontSize: "16px"}}
                      avatar={<Avatar alt="user" src={profilePicture}/>}
                      label={!isMobile?firstName:""}
                      size="big"/>
            </Stack>
        </div>
    );
}