import {useState} from 'react';
import GoogleLogin, {GoogleLogout} from "react-google-login";

function Authentication(props) {
    const handleLoginFailure = (result) => {
        alert(result);
    }
    const handleLoginSuccess = async (googleData) => {
        const user = JSON.stringify(googleData['profileObj'])
        localStorage.setItem('user', user);
        props.setUser(JSON.parse(localStorage.getItem('user')));


        const loginOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user)
        };
        await fetch('http://localhost:5050/login', loginOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
            })
            .catch(error => {
                alert("error logging in: ", error)
            });
        props.fetchRecords(JSON.parse(localStorage.getItem('user')));
    }
    const handleLogout = () => {
        localStorage.removeItem('user');
        props.setUser(null);
        props.clearData();
    }
    return (
        <div className={"options-item"}>
            {
                props.user ? (
                        <GoogleLogout
                            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                            buttonText={`Log Out`}
                            onLogoutSuccess={handleLogout}
                            cookiePolicy={'single_host_origin'}
                            className={"auth"}>

                        </GoogleLogout>
                    ) :
                    <GoogleLogin clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                 buttonText={"Log In"}
                                 onSuccess={handleLoginSuccess}
                                 onFailure={handleLoginFailure}
                                 cookiePolicy={'single_host_origin'}
                                 className={"auth"}>

                    </GoogleLogin>

            }

        </div>
    );
}

export default Authentication;
