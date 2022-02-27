import Switch from "./Switch";
import ImportButton from "./ImportButton";
import ExportButton from "./ExportButton";

export default function Options(props) {
    const instructions = props.instructions;
    const setInstructions = props.setInstructions;
    const instructionsTitle = "Instructions";
    const instructionsTooltip = "Adds or removes the instructions from the screen.";
    const rapidModeTitle = "Rapid Mode"
    const rapidModeTooltip = "Rapid Mode selects questions and answers automatically when there is only a single option. However, the user loses the flexibility to add, edit, or delete questions and answers.";

    function handleChangeInstructions(){
        setInstructions(!instructions);
    }
    return <div className="options">

        <Switch label={instructionsTitle} tooltipInfo={instructionsTooltip} checked = {instructions} handleChange = {handleChangeInstructions} />
        <Switch label={rapidModeTitle} tooltipInfo = {rapidModeTooltip}/>
        <ImportButton/>
        <ExportButton/>
    </div>;
}