import './App.css';
import Navigation from './Navigation/Navigation.js';
import QAContainer from "./QAContainer/QAContainer";
import History from "./History/History";
import React, {useState} from 'react';

function App() {
    const [instructions, setInstructions] = useState(true)
    const [history, setHistory] = useState([])
    const [mode, setMode] = useState("data")
    const [user, setUser] = useState(
        localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    );

    return (
        <div className="App">
            <Navigation instructions={instructions} setInstructions={setInstructions} user={user} setUser={setUser}
                        mode={mode} setMode={setMode}/>
            {
                mode === "tool"?
                    <>
                        <QAContainer instructions={instructions} history={history} setHistory={setHistory} user={user}/>
                        <History history={history} setHistory={setHistory} user={user}/>
                    </>
                    :<></>
            }

        </div>
    );
}

export default App;
