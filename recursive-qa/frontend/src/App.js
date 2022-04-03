import './App.css';
import Navigation from './Navigation/Navigation.js';
import QAContainer from "./QAContainer/QAContainer";
import History from "./History/History";
import React, {useState, useEffect} from 'react';
import Data from "./DataTab/Data";
import api from './constants';

function App() {
    const [instructions, setInstructions] = useState(true);
    const [history, setHistory] = useState([]);
    const [mode, setMode] = useState(
        localStorage.getItem('mode') ? (localStorage.getItem('mode')) : "left");
    const [user, setUser] = useState(
        localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
    const [records, setRecords] = useState([]);
    const [scheduled, setScheduled] = useState([]);

    const fetchRecords = async (userData) => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            cors: 'no-cors',
            body: JSON.stringify({user: userData})
        };
        await fetch(api + "records", requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                if (!response.ok) {
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                if (records != data.records) {
                    await setRecords(data.records);
                    await setScheduled(data.records.filter((record) => "scheduled" in record && record['scheduled'] === true));
                }
            })
            .catch(error => {
                console.log(error);
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
                        mode={mode} setMode={setMode} setRecords={setRecords} fetchRecords={fetchRecords}
                        clearData={clearData}/>
            {
                mode === "tool" ?
                    <>
                        <QAContainer instructions={instructions}
                                     scheduled={scheduled} setScheduled={setScheduled}
                                     history={history} setHistory={setHistory}
                                     user={user}
                                     fetchRecords={fetchRecords}
                                     mode={mode}
                        />
                        <History history={history} setHistory={setHistory} user={user}/>
                    </>
                    : <Data user={user}
                            records={records} setRecords={setRecords}
                            scheduled={scheduled} setScheduled={setScheduled}
                            fetchRecords={fetchRecords}/>
            }

        </div>
    );
}

export default App;
