import React from "react";
import Logo from "./Logo";
import './navigation.style.css'
import CompletionBar from "./CompletionBar";
import Options from "./Options";
import {isMobile} from "react-device-detect";

export default function Navigation(props) {
    return (<div className={'navigation-container'}>
        {!isMobile?<Logo/>:""}
        <Options instructions={props.instructions}
                 setInstructions={props.setInstructions}
                 user={props.user}
                 setUser={props.setUser}
                 mode={props.mode}
                 setMode={props.setMode}
                 setRecords={props.setRecords}
                 records={props.records}
                 setScheduled={props.setScheduled}
                 fetchRecords={props.fetchRecords}
                 clearData={props.clearData}
        />
    </div>);
}