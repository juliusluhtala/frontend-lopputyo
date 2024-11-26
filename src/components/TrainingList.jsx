import { useEffect } from "react";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import dayjs from "dayjs";
import AddTraining from "./AddTraining";
import { Button, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

export default function TrainingList() {

    const [trainings, setTrainings] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [msg, setMsg] = useState("");
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Vahvistusdialogi
    const [trainingToDelete, setTrainingToDelete] = useState(null);

    const [colDefs, setColDefs] = useState([
        {field: 'date', flex:1},
        {field: 'duration', flex:1},
        {field: 'activity', flex:1},
        {field: 'customerName', flex: 1},
        {cellRenderer: (params) =>
            <Button size="small" color="error" onClick={() => deleteTraining(params)}>Delete</Button>
        },
    ]);

    const deleteTraining = (params) => {
        setTrainingToDelete(params.data);
        setOpenConfirmDialog(true);
    }

    const handleDeleteConfirm = () => {
        const trainingId = trainingToDelete.id;
            
        fetch(`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings/${trainingId}`,
            { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setOpenSnackbar(true);
                    setMsg("Delete succeed");
                    getTrainings();
                }
                else {
                    openSnackbar(false);
                }
            })
            .catch(err => console.error(err.data))
            setOpenConfirmDialog(false);
    }

    const handleDeleteCancel = () => {
        setOpenConfirmDialog(false); // Sulje vahvistusdialogi ilman poistoa
    }

    const saveTraining = (training) => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(training),
        })
            .then((response) => {
                if (!response.ok){
                    setMsg('Something went wrong')
                    setOpenSnackbar(true);
                } else {
                    setMsg('Add succeed')
                    setOpenSnackbar(true);
                    getCustomers();
                }
            })
            .catch(err => console.error(err.data))
    };

    useEffect(() => {getTrainings();}, []);

    const getTrainings = async () => {
        try {
            const response = await fetch(
                "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch trainings");
            }

            const data = await response.json();

            // Format data to include customer name and formatted date
            const formattedData = data.map((training) => ({
                ...training,
                date: dayjs(training.date).format("DD.MM.YYYY HH:mm"),
                customerName: training.customer
                    ? `${training.customer.firstname} ${training.customer.lastname}`
                    : "Unknown",
            }));

            setTrainings(formattedData);
        } catch (error) {
            console.error("Error fetching trainings:", error);
        }
    };

    return (
        <>
            <AddTraining saveTraining={saveTraining}/>
            <div className="ag-theme-material" style={{ width: 900, height: 400 }}>
                <AgGridReact
                    rowData={trainings}
                    columnDefs={colDefs}
                    pagination={true}
                    paginationPageSize={5}
                    paginationPageSizeSelector={false}
                />
                <Snackbar
                    open={openSnackbar}
                    message={msg}
                    autoHideDuration={3000}
                    onClose={() => setOpenSnackbar(false)}
                />
                <Dialog open={openConfirmDialog} onClose={handleDeleteCancel}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <p>Are you sure you want to delete this training session?</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteCancel} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDeleteConfirm} color="error">
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
}
