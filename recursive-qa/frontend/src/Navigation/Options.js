import Switch from "./Switch";
import ImportButton from "./ImportButton";
import ExportButton from "./ExportButton";
import Authentication from "./Authentication";
import './navigation.style.css'
import UserBadge from "./UserBadge";
import Mode from "./Mode";
import {isMobile} from "react-device-detect";
import Logo from "./Logo";

export default function Options(props) {
    const instructions = props.instructions;
    const setInstructions = props.setInstructions;
    const instructionsTitle = "Instructions";
    const instructionsTooltip = "Adds or removes the instructions from the screen.";
    const rapidModeTitle = "Rapid Mode"
    const rapidModeTooltip = "Rapid Mode selects questions and answers automatically when there is only a single option. However, the user loses the flexibility to add, edit, or delete questions and answers.";

    function handleChangeInstructions() {
        setInstructions(!instructions);
    }

    return <div>
        {!isMobile ?
            <div className="options">
                {
                    props.user ? <UserBadge user={props.user}/> : ""
                }
                <Mode mode={props.mode} setMode={props.setMode}
                      setRecords={props.setRecords} records={props.records}
                      setScheduled={props.setScheduled}/>
                <Switch label={instructionsTitle} tooltipInfo={instructionsTooltip} checked={instructions}
                        handleChange={handleChangeInstructions}/>
                {/*<Switch className="options-item" label={rapidModeTitle} tooltipInfo={rapidModeTooltip}/>*/}
                <Authentication user={props.user} setUser={props.setUser} setRecords={props.setRecords}
                                fetchRecords={props.fetchRecords} clearData={props.clearData}/>
            </div> :
            <div>
                <div className="mobile-options">
                    <Logo/>
                </div>
                <div className="mobile-options">
                    <Mode mode={props.mode} setMode={props.setMode}
                          setRecords={props.setRecords} records={props.records}
                          setScheduled={props.setScheduled}/>
                    {
                        props.user ? <UserBadge user={props.user}/> : ""
                    }
                    <Authentication user={props.user} setUser={props.setUser} setRecords={props.setRecords}
                                    fetchRecords={props.fetchRecords} clearData={props.clearData}/>
                </div>
            </div>
        }
    </div>
}