import * as React from 'react';

import {useState} from "react";
import {gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";

function CustomPagination() {
    const [page, setPage] = useState(1);
    const pageCount = 5;
    return (
        <Pagination
            color="primary"
            variant="outlined"
            shape="rounded"
            page={page + 1}
            count={pageCount}
            // @ts-expect-error
            renderItem={(props2) => <PaginationItem {...props2} disableRipple/>}
            onChange={(event, value) => setPage(value - 1)}
            sx ={{borderColor:"#fff"}}
        />
    );
}

export default function AnnotationView(props) {

    return (
        <div>
            <h5>In the case current file handle represents an object of type NFS4DIR, NFS4ERR _ISDIR is returned</h5>
            <CustomPagination/>
        </div>
    );
}