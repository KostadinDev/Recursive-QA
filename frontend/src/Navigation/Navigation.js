import React from "react";
import Logo from "./Logo";
import './navigation.style.css'
import CompletionBar from "./CompletionBar";
import Options from "./Options";

export default class Navigation extends React.Component {
    render() {
        return <div className={'navigation-container'}>

            <Logo/>
            <CompletionBar/>
            <Options/>

        </div>;
    }
};