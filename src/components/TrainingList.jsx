import { useEffect } from "react";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import dayjs from "dayjs"; // Päivämäärien käsittelyä varten
import AddTraining from "./AddTraining";
import { Button, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css"; // Taulukon tyylit
import "ag-grid-community/styles/ag-theme-material.css"; // Material-design-teema

export default function TrainingList() {

    // State treenien tietojen tallentamiseen
    const [trainings, setTrainings] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbarin tila
    const [msg, setMsg] = useState(""); // Snackbarin viesti
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Vahvistusdialogin tila
    const [trainingToDelete, setTrainingToDelete] = useState(null); // Poistettava treeni

    // AgGrid-taulukon sarakeasetukset
    const [colDefs, setColDefs] = useState([
        { field: 'date', flex: 1 }, // Päivämäärä-sarake
        { field: 'duration', flex: 1 }, // Kesto-sarake
        { field: 'activity', flex: 1 }, // Aktiviteetti-sarake
        { field: 'customerName', flex: 1 }, // Asiakkaan nimi -sarake
        { 
            cellRenderer: (params) => 
                <Button size="small" color="error" onClick={() => deleteTraining(params)}>Delete</Button> // Poistopainike
        },
    ]);

    // Poistopainikkeen klikkaaminen
    const deleteTraining = (params) => {
        setTrainingToDelete(params.data); // Tallennetaan poistettava treeni stateen
        setOpenConfirmDialog(true); // Avataan vahvistusdialogi
    };

    // Poiston vahvistaminen
    const handleDeleteConfirm = () => {
        const trainingId = trainingToDelete.id; // Poistettavan treenin ID

        fetch(`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings/${trainingId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                setOpenSnackbar(true); // Näytetään onnistumisviesti
                setMsg("Delete succeed");
                getTrainings(); // Päivitetään treenilista
            } else {
                setMsg("Delete failed");
                setOpenSnackbar(true); // Näytetään virheviesti
            }
        })
        .catch(err => console.error(err.data));

        setOpenConfirmDialog(false); // Suljetaan dialogi
    };

    // Poiston peruminen
    const handleDeleteCancel = () => {
        setOpenConfirmDialog(false); // Suljetaan dialogi ilman poistoa
    };

    // Uuden treenin tallentaminen
    const saveTraining = (training) => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(training), // Lähetetään uusi treeni JSON-muodossa
        })
        .then(response => {
            if (!response.ok) {
                setMsg('Something went wrong'); // Virheilmoitus
                setOpenSnackbar(true);
            } else {
                setMsg('Add succeed'); // Onnistumisilmoitus
                setOpenSnackbar(true);
                getTrainings(); // Päivitetään treenilista
            }
        })
        .catch(err => console.error(err));
    };

    // Lataa treenit komponentin latautuessa
    useEffect(() => { getTrainings(); }, []);

    // Hakee kaikki treenit API:sta
    const getTrainings = async () => {
        try {
            const response = await fetch(
                "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch trainings");
            }

            const data = await response.json();

            // Muotoillaan data: lisätään asiakastiedot ja päivämäärän muotoilu
            const formattedData = data.map((training) => ({
                ...training,
                date: dayjs(training.date).format("DD.MM.YYYY HH:mm"), // Muotoillaan päivämäärä
                customerName: training.customer
                    ? `${training.customer.firstname} ${training.customer.lastname}` // Asiakkaan nimi
                    : "Unknown", // Jos asiakastietoja ei ole
            }));

            setTrainings(formattedData); // Asetetaan muotoiltu data stateen
        } catch (error) {
            console.error("Error fetching trainings:", error);
        }
    };

    return (
        <>
            {/* Uuden treenin lisäämiseen liittyvä komponentti */}
            <AddTraining saveTraining={saveTraining} />

            {/* Taulukko treenien näyttämiseen */}
            <div className="ag-theme-material" style={{ width: 900, height: 400 }}>
                <AgGridReact
                    rowData={trainings} // Treenidata
                    columnDefs={colDefs} // Sarakeasetukset
                    pagination={true}
                    paginationPageSize={5} // Sivutus 5 riviä per sivu
                    paginationPageSizeSelector={false}
                />

                {/* Snackbar ilmoituksille */}
                <Snackbar
                    open={openSnackbar}
                    message={msg}
                    autoHideDuration={3000} // Viesti sulkeutuu 3 sekunnissa
                    onClose={() => setOpenSnackbar(false)}
                />

                {/* Vahvistusdialogi poistamista varten */}
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
