import React, { useState,  useEffect} from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Select, MenuItem, InputLabel, FormControl} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function AddTraining(props) {

    const [open, setOpen] = useState(false);
    const [training, setTraining] = useState({date: new Date(), activity: '', duration: '', customer: ''});
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchCustomers();
    }, []);


    const fetchCustomers = async () => {
        try {
            const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers');
            const data = await response.json();
            setCustomers(data._embedded.customers || []);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSave = () => {
        props.saveTraining(training);
        setOpen(false);
        setTraining({ date: new Date(), activity: '', duration: '', customer: ''});
    };

    return (
        <>
            <Button onClick={() => setOpen(true)}>Add Training</Button>
            <Dialog 
                open={open}>
                <DialogTitle>
                    Add Training
                </DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            label="Date & Time"
                            value={training.date}
                            onChange={(newValue) => setTraining({ ...training, date: newValue })}
                            renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
                        />
                    </LocalizationProvider>
                    <TextField
                        label="Activity"
                        value={training.activity}
                        onChange={event => setTraining({ ...training, activity: event.target.value })}
                        fullWidth
                        margin="dense"
                        variant="standard"
                    />
                    <TextField
                        label="Duration (minutes)"
                        value={training.duration}
                        onChange={event => setTraining({ ...training, duration: event.target.value })}
                        fullWidth
                        margin="dense"
                        variant="standard"
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Customer</InputLabel>
                        <Select
                            value={training.customer}
                            onChange={(event) => setTraining({ ...training, customer: event.target.value })}
                            label="Customer"
                        >
                            {customers.map((customer) => (
                                <MenuItem key={customer.id} value={customer._links.customer.href}>
                                    {customer.firstname} {customer.lastname}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleSave()}>Save</Button>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}