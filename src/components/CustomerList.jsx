import { useEffect } from "react";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { Button, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";

export default function CustomerList() {

    // State asiakkaiden tietojen tallentamiseen
    const [customers, setCustomers] = useState([{firstname: '', lastname: '', streetaddress: '', postcode: '', city: '', email: '', phone: ''}]);
    const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbarin tila
    const [msg, setMsg] = useState(""); // Viesti Snackbarille
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Vahvistusdialogin tila
    const [customerToDelete, setCustomerToDelete] = useState(null); // Poistettava asiakas

    // Sarakeasetukset AgGridille
    const [colDefs, setColDefs] = useState([
        { field: 'firstname', flex: 1 }, // Etunimi
        { field: 'lastname', flex: 1 }, // Sukunimi
        { field: 'streetaddress', flex: 1 }, // Osoite
        { field: 'postcode', flex: 1 }, // Postinumero
        { field: 'city', flex: 1 }, // Kaupunki
        { field: 'email', flex: 1 }, // Sähköposti
        { field: 'phone', flex: 1 }, // Puhelinnumero
        { 
            maxWidth: 120, 
            cellRenderer: (params) => 
                <Button size="small" color="error" onClick={() => deleteCustomer(params)}>Delete</Button> // Poistopainike
        },
        { 
            maxWidth: 120, 
            cellRenderer: (params) => 
                <EditCustomer params={params} saveEditCustomer={saveEditCustomer}/> // Edit-painike
        }
    ]);

    // Uuden asiakkaan lisääminen
    const saveAddCustomer = (customer) => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(customer) // Lähetetään JSON-muodossa asiakastiedot
        })
        .then(response => {
            if (!response.ok) {
                setMsg('Something went wrong'); // Virheilmoitus
                setOpenSnackbar(true);
            } else {
                setMsg('Add succeed'); // Onnistumisilmoitus
                setOpenSnackbar(true);
                getCustomers(); // Päivitetään asiakaslista
            }
        })
        .catch(err => console.error(err));
    };

    // Asiakastietojen muokkaaminen
    const saveEditCustomer = (customer, id) => {
        fetch(`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(customer) // Lähetetään päivitetyt tiedot
        })
        .then(response => {
            if (!response.ok) {
                setMsg('Something went wrong'); // Virheilmoitus
                setOpenSnackbar(true);
                console.error(err);
            } else {
                setMsg('Edit succeed'); // Onnistumisilmoitus
                setOpenSnackbar(true);
                getCustomers(); // Päivitetään asiakaslista
            }
        })
        .catch(err => console.error(err));
    };

    // Poistodialogin avaaminen
    const deleteCustomer = (params) => {
        setCustomerToDelete(params.data); // Tallennetaan poistettava asiakas
        setOpenConfirmDialog(true); // Avataan dialogi
    };

    // Asiakkaan poistaminen vahvistuksen jälkeen
    const handleDeleteConfirm = () => {
        const customerUrl = customerToDelete._links.customer.href; // Asiakkaan URL

        fetch(customerUrl, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setOpenSnackbar(true);
                    setMsg("Delete succeed"); // Onnistumisviesti
                    getCustomers(); // Päivitetään asiakaslista
                } else {
                    setOpenSnackbar(true);
                    setMsg("Delete failed"); // Virheviesti
                }
            })
            .catch(err => console.error(err));
        
        setOpenConfirmDialog(false); // Suljetaan dialogi
    };

    // Poiston peruminen
    const handleDeleteCancel = () => {
        setOpenConfirmDialog(false); // Suljetaan dialogi ilman poistoa
    };

    // Hae asiakkaat sovelluksen latautuessa
    useEffect(() => getCustomers(), []);

    // Asiakkaiden hakeminen API:sta
    const getCustomers = () => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                console.log("data ", data._embedded.customers); // Debug: näytetään tiedot konsolissa
                setCustomers(data._embedded.customers); // Asetetaan asiakastiedot stateen
            })
            .catch(err => console.error(err));
    };

    return (
        <>
            {/* Komponentti uuden asiakkaan lisäämiselle */}
            <AddCustomer saveAddCustomer={saveAddCustomer} />

            <div style={{ display: "grid", justifyContent: "center" }}>
                <div className="ag-theme-material" style={{ width: 1500, height: 400 }}>
                    <AgGridReact
                        rowData={customers} // Asiakasdata
                        columnDefs={colDefs} // Sarakeasetukset
                        pagination={true}
                        paginationPageSize={5}
                        paginationPageSizeSelector={false}
                    />

                    {/* Snackbar käyttäjäviesteille */}
                    <Snackbar
                        open={openSnackbar}
                        message={msg}
                        autoHideDuration={3000}
                        onClose={() => setOpenSnackbar(false)}
                    />

                    {/* Vahvistusdialogi poistamista varten */}
                    <Dialog open={openConfirmDialog} onClose={handleDeleteCancel}>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <p>Are you sure you want to delete this customer?</p>
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
            </div>
        </>
    );
}
