import './App.css';
import Navigation from './Navigation/Navigation.js';
import QAContainer from "./QAContainer/QAContainer";
import History from "./History/History";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';

function App() {
    const [instructions, setInstructions] = useState(true)
    const [history, setHistory] = useState([])
    return (
        <div className="App">
            <Navigation instructions={instructions} setInstructions={setInstructions}></Navigation>
            <QAContainer instructions={instructions} history={history} setHistory={setHistory}></QAContainer>
            <History history={history} setHistory={setHistory}></History>
        </div>
    );
}

export default App;
