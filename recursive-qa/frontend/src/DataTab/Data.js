import React, {useState} from 'react';
import {
    DataGrid, GridRowsProp, GridColDef, GridToolbarContainer,
    GridToolbarDensitySelector, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbar
} from '@mui/x-data-grid';

import {
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
} from '@mui/x-data-grid';
import {styled} from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ImportButton from "../Navigation/ImportButton";
import RemoveButton from "./RemoveButton";
import './data.styles.css';
import FlagButton from "./FlagButton";
import ScheduleButton from "./ScheduleButton";
import Flag from '@mui/icons-material/Flag';
import Schedule from '@mui/icons-material/Schedule';
import Done from '@mui/icons-material/Done';
import PriorityHigh from '@mui/icons-material/PriorityHigh';
import {GridRenderCellParams} from "@mui/x-data-grid";
import ExportButton from "./ExportButton";
import ViewButton from "./ViewButton";
import AnnotationView from "./AnnotationView";
import {SkipNext} from "@mui/icons-material";
import TreeGraph from "./TreeGraph";

const StyledDataGrid = styled(DataGrid)(({theme}) => ({
    border: 0,
    // color:
    //     theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
    color: "white",
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    WebkitFontSmoothing: 'auto',
    letterSpacing: 'normal',
    '& .MuiDataGrid-columnsContainer': {
        backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d',
    },
    '& .MuiDataGrid-iconSeparator': {
        display: 'none',
    },
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {},
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
        borderBottom: `1px solid ${
            theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
        }`,
    },
    '& .MuiDataGrid-cell': {
        color:
            theme.palette.mode === 'light' ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.65)',
    },
    '& .MuiPaginationItem-root': {
        borderRadius: 0,
        color: "white",
    },
    ...customCheckbox(theme),
}));

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton/>
            <GridToolbarFilterButton/>
            <GridToolbarDensitySelector/>
        </GridToolbarContainer>
    );
}


const columns: GridColDef[] = [
    {field: 'sentence', headerName: 'Sentence', width: 800},
    {
        field: 'status', headerName: 'Status', width: 150, renderCell: (params: GridRenderCellParams<String>) => (
            <div style={{
                display: "flex",
                width: "100%",
                "flex-direction": "row",
                "justify-content": "left",
            }}>{params.value == "complete" ? <div style={{
                border: "1px solid",
                'border-radius': '15px',
                fontSize: "12px",
                padding: '2px 8px',
                color: "#2e7d32",
                borderColor: "rgb(102, 187, 106)"
            }}><Done fontSize={"small"}/> completed</div> : ""}{
                params.value == "scheduled" ?
                    <div style={{
                        border: "1px solid",
                        'border-radius': '15px',
                        fontSize: "12px",
                        padding: '2px 8px',
                        color: "rgb(245, 124, 0)",
                        borderColor: "rgb(255, 167, 38)"
                    }}><Schedule fontSize={"small"}/> scheduled</div> : ""}
                {
                    params.value == "incomplete" ?
                        <div style={{
                            border: "1px solid",
                            'border-radius': '15px',
                            fontSize: "12px",
                            padding: '2px 8px',
                            color: "rgb(211, 47, 47)",
                            borderColor: "rgb(244, 67, 54)"
                        }}><PriorityHigh fontSize={"small"}/> incomplete</div> : ""}</div>
        ),
    },
    {
        field: 'scheduled', headerName: 'Scheduled', width: 120, renderCell: (params: GridRenderCellParams<String>) => (
            <div style={{
                display: "flex",
                width: "100%",
                "flex-direction": "row",
                "justify-content": "left",
                "margin-left": "25px",
                color: "rgb(245, 124, 0)"
            }}>{params.value ? <Schedule/> : ""}</div>
        ),
    },
    {
        field: 'flagged', headerName: 'Flagged', width: 120, renderCell: (params: GridRenderCellParams<String>) => (
            <div style={{
                display: "flex",
                width: "100%",
                "flex-direction": "row",
                "justify-content": "left",
                "margin-left": "20px"
            }}>{params.value ? <Flag color={"secondary"}/> : ""}</div>
        ),
    },
    {
        field: 'skipped', headerName: 'Skipped', width: 120, renderCell: (params: GridRenderCellParams<String>) => (
            <div style={{
                display: "flex",
                width: "100%",
                "flex-direction": "row",
                "justify-content": "left",
                "margin-left": "20px"
            }}>{params.value ? <SkipNext color={"warning"}/> : ""}</div>
        ),
    },
    {field: 'col3', headerName: 'Date', width: 150},
    {field: 'col6', headerName: 'Time', width: 150},
    {field: 'user', headerName: 'User', width: 150},
];


function customCheckbox(theme) {
    return {
        '& .MuiCheckbox-root svg': {
            width: 16,
            height: 16,
            backgroundColor: 'transparent',
            border: `1px solid ${
                theme.palette.mode === 'light' ? '#d9d9d9' : 'rgb(67, 67, 67)'
            }`,
            borderRadius: 2,
        },
    };
}

function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    return (
        <Pagination
            color="primary"
            variant="outlined"
            shape="rounded"
            page={page + 1}
            count={pageCount}
            // @ts-expect-error
            renderItem={(props2) => <PaginationItem {...props2} disableRipple/>}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
    );
}


export default function Data(props) {
    const [selectionModel, setSelectionModel] = useState();
    const rows: GridRowDef = [...props.records];
    const [pageSize, setPageSize] = React.useState(25);
    return (
        <div style={{width: '80%', height: '450px'}}>
            HELLO
            {/*/<TreeGraph/>*/}
            <div style={{height: "250px", display: "flex", "flex-direction": "row"}}>
                {/*<AnnotationView/>*/}
            </div>
            <div style={{height: '100%', display: 'flex'}}>
                <div style={{flexGrow: 1}}>
                    {/*<button onClick={() => {*/}
                    {/*    console.log(props.scheduled);*/}
                    {/*    console.log(props.records);*/}
                    {/*}}> button*/}
                    {/*</button>*/}
                    <StyledDataGrid rows={rows}
                                    columns={columns}
                                    sx={{color: "white"}}
                                    pageSize={10}
                                    rowsPerPageOptions={[5]}
                                    components={{
                                        Pagination: CustomPagination,
                                        Toolbar: CustomToolbar,
                                    }}
                                    checkboxSelection
                                    onSelectionModelChange={(newSelectionModel) => {
                                        setSelectionModel(newSelectionModel)
                                    }}
                                    selectionModel={selectionModel}
                    />
                </div>
            </div>
            <br/>
            <div className={"data-buttons"}>
                <ImportButton records={props.records} setRecords={props.setRecords} user={props.user}
                              selectionModel={selectionModel} fetchRecords={props.fetchRecords}/>
                <ExportButton records={props.records} setRecords={props.setRecords} user={props.user}
                              selectionModel={selectionModel} fetchRecords={props.fetchRecords}/>
                {/*<ViewButton records={props.records} setRecords={props.setRecords} user={props.user}*/}
                {/*            selectionModel={selectionModel} fetchRecords={props.fetchRecords}/>*/}
                <ScheduleButton records={props.records} setRecords={props.setRecords} user={props.user}
                                selectionModel={selectionModel} fetchRecords={props.fetchRecords}/>
                <RemoveButton records={props.records} setRecords={props.setRecords} user={props.user}
                              selectionModel={selectionModel} fetchRecords={props.fetchRecords}/>
                <FlagButton records={props.records} setRecords={props.setRecords} user={props.user}
                            selectionModel={selectionModel} fetchRecords={props.fetchRecords}/>
            </div>
        </div>
    );
}