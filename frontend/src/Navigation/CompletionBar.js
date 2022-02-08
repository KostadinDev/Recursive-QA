import {ProgressBar} from "react-bootstrap";
import './navigation.style.css'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CompletionBar(props) {
    const now = 60;

    const progressInstance = <ProgressBar animated now={now} label={`${now}%`} />;
    return <div className = 'completion-bar'>

        {/*<div className="container">*/}
        {/*    <div className="row">*/}
        {/*        <div className="col-md-12">*/}
        {/*            <div className="progress">*/}
        {/*                <div className="progress-bar">*/}
        {/*                    <div className="progress-value">65%</div>*/}
        {/*                </div>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*    </div>*/}
        {/*</div>*/}
    </div>;
}