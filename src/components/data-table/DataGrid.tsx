import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowParams, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import * as _ from 'lodash';

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
        width: 200,
        editable: false,
        resizable: true,
        type: 'actions',
        renderCell: (params) => <CustomShowMoreCell params={params} />,
    },
    {
        field: 'category',
        headerName: 'Category',
        width: 300,
        editable: false,
        resizable: true,
        type: 'string',
        renderCell: (params) => <CustomCategoryList params={params} />,
        valueGetter: (params) => {
            return _.uniqBy(params.row?.feedback, 'category').map((value) => value?.category).join(', ')
        }
    },
];

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CustomCategoryList = ({ ...params }) => {
    const categoryList = _.uniqBy(params.params?.row.feedback, 'category');

    return (<div className='m-2'>
        {categoryList?.length ?
            categoryList?.map((feedback) => <span key={feedback?.category} className='my-2'><p className='text-xs font-normal'>{`${feedback?.category}.`}</p></span>) :
            '-'}
    </div>)
}

const CustomShowMoreCell = ({ ...params }) => {

    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<GridRowParams<any>>();

    const listOfFeedback = params.params.value.filter((feedback) => !!feedback.feedback);
    const handleClickOpen = () => {
        setSelectedRow(params.params);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (<div>
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
                        selectedRow?.row.feedback?.map((feedback) => <div key={feedback.feedback} className='my-2'><p className='text-sm font-semibold'>{`${feedback?.feedback}.`}</p><p className='text-xs font-normal'>{`given by ${feedback?.givenBy}`}</p></div>) :
                        'no feedback'}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>close</Button>
            </DialogActions>
        </Dialog>
        <div className='row flex justify-center items-center'>
            <div className='px-3' >{`${listOfFeedback?.length}`}</div>
            <Button onClick={handleClickOpen} disabled={listOfFeedback < 1} color='info' className='text-blue-700 my-2'>{' Show more '}</Button>
        </div>
    </div>)
}


function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
  
export const MainDataGrid = ({ rows, col }: { rows: any[], col: GridColDef[] }) => {

    return (
        <div className='bg-white p-4 rounded-md'>
            <label className="text-lg font-semibold">{'Top Rated Employees'}</label>
            <Box sx={{ width: '100%', height: 400 }}>
                <DataGrid
                    rows={rows}
                    columns={col}
                    slots={{ toolbar: CustomToolbar }} 
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
                />
            </Box>
        </div>
    );
}