import React from "react";
import Logo from "./Logo";
import './navigation.style.css'
import CompletionBar from "./CompletionBar";
import Options from "./Options";

export default function Navigation(props) {
    return (<div className={'navigation-container'}>

        <Logo/>
        <Options instructions={props.instructions}
                 setInstructions={props.setInstructions}
                 user = {props.user}
                 setUser = {props.setUser}
                 mode = {props.mode}
                 setMode = {props.setMode}
        />
    </div>);
}