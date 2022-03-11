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
        console.log(user);
    }
    const handleLogout = () => {
        localStorage.removeItem('user');
        props.setUser(null);
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
