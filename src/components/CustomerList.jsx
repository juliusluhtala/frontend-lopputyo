import { useEffect } from "react";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { Button, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";

export default function CustomerList() {

    const [customers, setCustomers] = useState([{firstname: '', lastname: '', streetaddress: '', postcode: '', city: '', email: '', phone: ''}])
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [msg, setMsg] = useState("");
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Vahvistusdialogi
    const [customerToDelete, setCustomerToDelete] = useState(null);

    const [colDefs, setColDefs] = useState([
        {field: 'firstname', flex:1},
        {field: 'lastname', flex:1},
        {field: 'streetaddress', flex:1},
        {field: 'postcode', flex:1},
        {field: 'city', flex:1},
        {field: 'email', flex:1},
        {field: 'phone', flex:1},
        {maxWidth: 120, cellRenderer: (params) =>
            <Button size="small" color="error" onClick={() => deleteCustomer(params)}>Delete</Button>
        },
        {maxWidth: 120, cellRenderer: (params) => 
            <EditCustomer params={params} saveEditCustomer={saveEditCustomer}/>
        }
    ]);

    const saveAddCustomer = (customer) => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(customer)
            }
        )
        .then(response => {
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
    }

    const saveEditCustomer = (customer, id) => {
        fetch(`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(customer)
            }
        )
        .then(response => {
            if (!response.ok){
                setMsg('Something went wrong')
                setOpenSnackbar(true);
                console.error(err);
            } else {
                setMsg('Edit succeed')
                setOpenSnackbar(true);
                getCustomers();
            }
        })
        .catch(err => console.error(err.data))
    }

    const deleteCustomer = (params) => {
        setCustomerToDelete(params.data); // Tallenna poistettava asiakas
        setOpenConfirmDialog(true); // Avaa vahvistusdialogi
    }

    const handleDeleteConfirm = () => {
        const customerUrl = customerToDelete._links.customer.href;

        fetch(customerUrl,
            { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setOpenSnackbar(true);
                    setMsg("Delete succeed");
                    getCustomers();
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

    useEffect(() => getCustomers(), [])

    const getCustomers = () => {
        fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers',
            {method: 'GET'})
            .then(response => {
                return response.json()
            })
            .then(data => {
                console.log("data ", data._embedded.customers);
                setCustomers(data._embedded.customers);
            })
            .catch(err => {

            })
    }

    return (
        <>
            <AddCustomer saveAddCustomer={saveAddCustomer}/>
            <div style={{ display: "grid", justifyContent: "center"}}>
            <div className="ag-theme-material" style={{ width: 1500, height: 400 }}>
                <AgGridReact
                    rowData={customers}
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
    )
}