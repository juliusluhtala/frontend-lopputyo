import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function AddTraining(props) {

    // Tilan hallinta
    const [open, setOpen] = useState(false); // Dialogin aukiolo
    const [training, setTraining] = useState({
        date: new Date(), // Treenin päivämäärä ja aika
        activity: '', // Treenin aktiviteetti
        duration: '', // Treenin kesto
        customer: '' // Treeniin liittyvä asiakas
    });
    const [customers, setCustomers] = useState([]); // Asiakasvalikon data

    // Haetaan asiakkaat, kun komponentti latautuu
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Hakee asiakkaat API:sta ja asettaa ne stateen
    const fetchCustomers = async () => {
        try {
            const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers');
            const data = await response.json();
            setCustomers(data._embedded.customers || []); // Asetetaan asiakkaat tai tyhjä lista
        } catch (error) {
            console.log(error); // Lokitetaan virhe, jos haku epäonnistuu
        }
    };

    // Käsittelee uuden treenin tallentamisen
    const handleSave = () => {
        props.saveTraining(training); // Kutsuu ylätason `saveTraining`-funktiota
        setOpen(false); // Sulkee dialogin
        setTraining({ date: new Date(), activity: '', duration: '', customer: '' }); // Nollaa lomakkeen
    };

    return (
        <>
            {/* Painike, joka avaa treenin lisäysdialogin */}
            <Button onClick={() => setOpen(true)}>Add Training</Button>

            {/* Treenin lisäysdialogi */}
            <Dialog open={open}>
                <DialogTitle>
                    Add Training
                </DialogTitle>
                <DialogContent>
                    {/* Päivämäärän ja ajan valitsin */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Date & Time"
                            value={training.date} // Valittu päivämäärä
                            onChange={(newValue) => setTraining({ ...training, date: newValue })} // Päivittää stateen
                            renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                        />
                    </LocalizationProvider>

                    {/* Aktiviteetti-tekstikenttä */}
                    <TextField
                        label="Activity"
                        value={training.activity} // Valittu aktiviteetti
                        onChange={event => setTraining({ ...training, activity: event.target.value })} // Päivittää stateen
                        fullWidth
                        margin="dense"
                        variant="standard"
                    />

                    {/* Kesto-tekstikenttä */}
                    <TextField
                        label="Duration (minutes)"
                        value={training.duration} // Valittu kesto
                        onChange={event => setTraining({ ...training, duration: event.target.value })} // Päivittää stateen
                        fullWidth
                        margin="dense"
                        variant="standard"
                    />

                    {/* Asiakasvalikko */}
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Customer</InputLabel>
                        <Select
                            value={training.customer} // Valittu asiakas
                            onChange={(event) => setTraining({ ...training, customer: event.target.value })} // Päivittää stateen
                            label="Customer"
                        >
                            {/* Asiakkaiden renderöinti valikkovaihtoehdoiksi */}
                            {customers.map((customer) => (
                                <MenuItem key={customer.id} value={customer._links.customer.href}>
                                    {customer.firstname} {customer.lastname} {/* Näytetään asiakkaan nimi */}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    {/* Tallennus- ja sulkupainikkeet */}
                    <Button onClick={() => handleSave()}>Save</Button> {/* Tallentaa tiedot */}
                    <Button onClick={() => setOpen(false)}>Close</Button> {/* Sulkee dialogin */}
                </DialogActions>
            </Dialog>
        </>
    )
}
