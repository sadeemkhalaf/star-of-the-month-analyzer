import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { IResponsesOtherCases } from '../../main/shared/model';

export enum DatagridType {
    selfVoted = 'SELF-VOTED',
    votedFrequently = 'VOTED-FREQUENTLY'
}

export const columnsSelfVoted: GridColDef<IResponsesOtherCases>[] = [
    { field: 'ID', headerName: 'ID', width: 90 },
    {
        headerName: 'Name',
        field: 'name',
        width: 200,
        editable: false,
    },
    {
        field: 'ratingCount',
        headerName: 'How many times',
        width: 90,
        editable: false,
    },
];

export const columnsVotedFrequently: GridColDef<IResponsesOtherCases>[] = [
    { field: 'ID', headerName: 'ID', width: 90 },
    {
        headerName: 'Name',
        field: 'name',
        width: 150,
        editable: false,
    },
    {
        field: 'ratingCount',
        headerName: 'How many times',
        width: 150,
        editable: false,
    },
];

export const SubDataGrid = ({ rows, votingType }: { rows: any[], votingType: DatagridType }) => {

    return (
        <Box sx={{ width: '100%', height: rows.length > 0 ? 300 : 120 }}>
            <DataGrid
                rows={rows}
                columns={votingType === DatagridType.selfVoted ? columnsSelfVoted : columnsVotedFrequently}
                checkboxSelection={false}
                getRowId={(row) => row.ID}
                disableRowSelectionOnClick
            />
        </Box>
    );
}