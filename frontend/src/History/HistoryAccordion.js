import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './history.styles.css'

export default function HistoryAccordion(props) {
    const [history, setHistory] = [props.history, props.setHistory];
    const [expanded, setExpanded] = React.useState(false);
    const questions = ['What if it ']
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    function formatText(text) {
        const sbar = text.toLowerCase().includes("if ") ? true : false;
        const question = sbar ? "What happens " : "What "
        return question + text.toLowerCase();
    }

    return (
        <div className="history-accordion">
            {
                history ? history.map((qa) => {
                    return <>
                        <Accordion key={qa['segment']} expanded={expanded === qa['segment']}
                                   onChange={handleChange(qa['segment'])} sx={{
                            backgroundColor: "rgb(10, 25, 41)",
                            borderBottom: '1px solid grey',
                            borderRadius: '5px',
                            borderColor: '#5090D3',
                            width: "100%",
                        }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                                sx={{
                                    backgroundColor: "rgb(10, 25, 41)",
                                    borderRadius: 5,
                                    width: '100%',
                                    justifyContent: "unset"
                                }}
                                className="accordion-summary"
                            >
                                <div className="accordion-column">{"Q: " + formatText(qa['question'])}</div>
                                <div className="accordion-column">{"A: " + qa['answer']}</div>

                                {/*<Typography sx={{color: "white", width: '50%'}}>*/}
                                {/*    {"Q: " + formatText(qa['question'])}*/}
                                {/*</Typography>*/}
                                {/*<Typography sx={{color: 'white', width: '50%'}}>{"A: " + qa['answer']}</Typography>*/}
                            </AccordionSummary>
                            <AccordionDetails sx={{
                                backgroundColor: "rgb(10, 25, 41)",
                                borderRadius: 5,
                                width: '100%',
                                justifyContent: "unset"
                            }}>
                                <div className='accordion-details'>{qa['segment'] + ": segment"}</div>
                                <div className='accordion-details'>{ qa['question'] + ": {span type}"}</div>
                                <div className='accordion-details'>{qa['answer'] + ": {span type}"}</div>
                                <div className='accordion-details'>{"Relation: {relation type}"}</div>

                                {/*<Typography sx={{color: 'white', width: '100%'}}>*/}
                                {/*    {"S: " + qa['segment']}*/}
                                {/*</Typography>*/}
                            </AccordionDetails>
                        </Accordion></>

                }) : "none"
            }


        </div>
    );
}