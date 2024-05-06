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
        width: 150,
        editable: false,
    },
    {
        field: 'ratingCount',
        headerName: 'How many times?',
        width: 150,
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
        headerName: 'How many stars?',
        width: 150,
        editable: false,
    },
];

export const SubDataGrid = ({ rows, votingType }: { rows: any[], votingType: DatagridType }) => {

    return (
        <Box sx={{ width: '100%', height: 300 }}>
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