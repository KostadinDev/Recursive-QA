import './App.css';
import Navigation from './Navigation/Navigation.js';
import QAContainer from "./QAContainer/QAContainer";
import History from "./History";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';

function App() {

    return (
        <div className="App">
            <Navigation></Navigation>
            <QAContainer></QAContainer>
            {/*<History></History>*/}
        </div>
    );
}

export default App;
