import React, {useState} from 'react';
import HistoryAccordion from "./HistoryAccordion";
import './history.styles.css';
export default function History(props) {
    return (
        <div className="history">
            <h3>History</h3>
            <HistoryAccordion history={props.history} setHistory={props.setHistory}/>

        </div>
    );
};
