import { useEffect } from "react";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { Button, Snackbar } from "@mui/material";

export default function CustomerList() {

    const [customers, setCustomers] = useState([{firstname: '', lastname: '', streetaddress: '', postcode: '', city: '', email: '', phone: ''}])

    const [colDefs, setColDefs] = useState([
        {field: 'firstname', flex:1},
        {field: 'lastname', flex:1},
        {field: 'streetaddress', flex:1},
        {field: 'postcode', flex:1},
        {field: 'city', flex:1},
        {field: 'email', flex:1},
        {field: 'phone', flex:1}
    ]);

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
            <div className="ag-theme-material" style={{ width: 900, height: 400 }}>
                <AgGridReact
                    rowData={cars}
                    columnDefs={colDefs}
                    pagination={true}
                    paginationPageSize={5}
                    paginationPageSizeSelector={false}
                >
                </AgGridReact>
            </div>
        </>
    )
}