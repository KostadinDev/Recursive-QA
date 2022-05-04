import React, {useState} from 'react';
import HistoryAccordion from "./HistoryAccordion";
import './history.styles.css';
import {isMobile} from "react-device-detect";
export default function History(props) {
    return (
        <div className={!isMobile?"history":""}>
            <h3>History</h3>
            <HistoryAccordion history={props.history} setHistory={props.setHistory}/>

        </div>
    );
};
