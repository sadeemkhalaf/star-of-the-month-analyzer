import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

// ID	
// Start time
// Completion time
// Email
// Name
// To whom would you like to say thank you and give him/her a star?
// How many stars would you like to give this person?
// Tell us why you would like to thank this person?

export const columns: GridColDef[] = [
    { field: 'ID', headerName: 'ID', width: 90 },
    {
        field: 'email',
        headerName: 'Email',
        width: 150,
        editable: false,
    },
    {
        headerName: 'Name',
        field: 'name',
        width: 150,
        editable: false,
    },
    {
        field: 'whom',
        headerName: 'to whom',
        width: 150,
        editable: false,
    },
    {
        field: 'rating',
        headerName: 'Rating',
        width: 90,
        type: 'number',
        editable: false,
    },
    {
        field: 'feedback',
        headerName: 'Feedback',
        width: 220,
        editable: false,
    },
];

export const columnsRes: GridColDef[] = [
    { field: 'ID', headerName: 'ID', width: 90 },
    {
        field: 'whom',
        headerName: 'to whom',
        width: 150,
        editable: false,
    },
    {
        field: 'rating',
        headerName: 'Rating',
        width: 90,
        type: 'number',
        editable: false,
    },
    {
        field: 'feedback',
        headerName: 'Feedback count',
        width: 500,
        editable: false,
        resizable: true,
        renderCell: (params) => {
            const listOfFeedback = params.value;
            return (<div>
                {`${listOfFeedback?.length}  -  `}
                <span className='text-blue-700 my-2'>{' Show more '}</span>
            </div>)
        },
    }
];

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export const MainDataGrid = ({ rows, col }: { rows: any[], col: GridColDef[] }) => {

    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<GridRowParams<any>>();

    const handleClickOpen = (params: GridRowParams<any>) => {
        setSelectedRow(params);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className='bg-white p-4 rounded-md'>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Feedback given:"}</DialogTitle>
                <DialogContent>
                    <div>
                        {selectedRow?.row.feedback?.length ? 
                        selectedRow?.row.feedback?.map((feedback) => <div key={feedback.feedback} className='my-2'><p className='text-sm font-semibold'>{`${feedback?.feedback},`}</p><p className='text-xs font-normal'>{`given by ${feedback?.givenBy}`}</p></div>) : 
                        'no feedback'}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>close</Button>
                </DialogActions>
            </Dialog>
            <label className="text-lg font-semibold">{'Top Rated Employees'}</label>
            <Box sx={{ width: '100%', height: 400 }}>
                <DataGrid
                    rows={rows}
                    columns={col}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 25,
                            },
                        },
                    }}
                    checkboxSelection={false}
                    getRowId={(row) => row.ID}
                    disableRowSelectionOnClick
                    onRowClick={(params) => handleClickOpen(params)}
                />
            </Box>
        </div>
    );
}