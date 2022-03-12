import React from 'react';
import {
    DataGrid, GridRowsProp, GridColDef, GridToolbarContainer,
    GridToolbarDensitySelector, GridToolbar
} from '@mui/x-data-grid';

import {
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
} from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 0,
    // color:
    //     theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
    color:"white",
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
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    },
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
        color:"white",
    },
    ...customCheckbox(theme),
}));

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarDensitySelector/>
        </GridToolbarContainer>
    );
}

const rows: GridRowsProp = [
    {id: 1, col1: 'Hello', col2: 'World'},
    {id: 2, col1: 'DataGridProDataGridProDataGridProDataGridPro', col2: 'is Awesome'},
    {id: 3, col1: 'MUI', col2: 'is Amazing'},
    {id: 4, col1: 'Hello', col2: 'World'},
    {id: 5, col1: 'DataGridPro', col2: 'is Awesome'},
    {id: 6, col1: 'MUI', col2: 'is Amazing'},
    {id: 7, col1: 'Hello', col2: 'World'},
    {id: 8, col1: 'DataGridPro', col2: 'is Awesome'},
    {id: 9, col1: 'MUI', col2: 'is Amazing'},
    {id: 10, col1: 'Hello', col2: 'World'},
    {id: 11, col1: 'DataGridPro', col2: 'is Awesome'},
    {id: 12, col1: 'MUI', col2: 'is Amazing'},
    {id: 13, col1: 'Hello', col2: 'World'},
    {id: 14, col1: 'DataGridPro', col2: 'is Awesome'},
    {id: 15, col1: 'MUI', col2: 'is Amazing'},
    {id: 16, col1: 'Hello', col2: 'World'},
    {id: 17, col1: 'DataGridPro', col2: 'is Awesome'},
    {id: 18, col1: 'MUI', col2: 'is Amazing'},
];

const columns: GridColDef[] = [
    {field: 'col1', headerName: 'Sentence', width: 600},
    {field: 'col2', headerName: 'Status', width: 150},
    {field: 'col5', headerName: 'Action', width: 150},
    {field: 'col3', headerName: 'Date', width: 150},
    {field: 'col6', headerName: 'Time', width: 150},
    {field: 'col4', headerName: 'User', width: 150},
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
            renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
    );
}


export default function Data() {
    const [pageSize, setPageSize] = React.useState(25);
    return (
        <div style={{width: '60%', height: '600px'}}>
            <div style={{height: '100%', display: 'flex'}}>
                <div style={{flexGrow: 1}}>
                    <StyledDataGrid rows={rows}
                              columns={columns}
                              sx={{color: "white"}}
                              // components={{
                              //     Toolbar: GridToolbar,
                              // }}
                              pageSize={10}
                              rowsPerPageOptions={[5]}
                              components={{
                                  Pagination: CustomPagination,
                              }}
                              checkboxSelection/>
                </div>
            </div>
        </div>
    );
}