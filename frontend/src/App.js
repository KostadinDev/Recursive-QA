import './App.css';
import Navigation from './Navigation/Navigation.js';
import QAContainer from "./QAContainer/QAContainer";
import History from "./History/History";
import React, {useState, useEffect} from 'react';
import Data from "./DataTab/Data";

function App() {
    const [instructions, setInstructions] = useState(true)
    const [history, setHistory] = useState([])
    const [mode, setMode] = useState("tool")
    const [user, setUser] = useState(
        localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    );
    const [records, setRecords] = useState([]);

    const fetchRecords = (userData) => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            cors: 'no-cors',
            body: JSON.stringify({user: userData})
        };
        fetch('http://localhost:5050/records', requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                if (!response.ok) {
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                if (records != data.records) {
                    setRecords(data.records);
                }
            })
            .catch(error => {
                alert(error);
            });
    }
    const clearData = () => {
        setRecords([]);
    }

    useEffect(() => {
        if (user && !records.length) {
            fetchRecords(user)
        }
    }, [records]);
    return (
        <div className="App">
            <Navigation instructions={instructions} setInstructions={setInstructions} user={user} setUser={setUser}
                        mode={mode} setMode={setMode} setRecords={setRecords} fetchRecords={fetchRecords} clearData={clearData}/>
            {
                mode === "tool" ?
                    <>
                        <QAContainer instructions={instructions} history={history} setHistory={setHistory} user={user}/>
                        <History history={history} setHistory={setHistory} user={user}/>
                    </>
                    : <Data user={user} records={records} setRecords={setRecords} fetchRecords={fetchRecords}></Data>
            }

        </div>
    );
}

export default App;
