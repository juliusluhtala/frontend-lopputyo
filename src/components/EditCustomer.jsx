import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";

export default function EditCustomer(props)  {
    const { params, saveEditCustomer } = props;
    const { data } = params;

    const [open, setOpen] = useState(false);
    const [customer, setCustomer] = useState({firstname: '', lastname: '', streetaddress: '', postcode: '', city: '', email: '', phone: ''});

    const handleDialogOpen = () => {
        console.log(props.params.data);
        setCustomer(
            {   firstname: props.params.data.firstname, 
                lastname: props.params.data.lastname, 
                streetaddress: props.params.data.streetaddress, 
                postcode: props.params.data.postcode,
                city: props.params.data.city,
                email: props.params.data.email, 
                phone: props.params.data.phone });
        setOpen(true);
    }

    const handleSave = () => {
        const id = props.params.data._links.customer.href.split('/').pop();
        console.log(id);
        if (!id) {
            console.error('Customer ID is missing');
            return;
        }
        props.saveEditCustomer(customer, id);
        setOpen(false);
        setCustomer({firstname: '', lastname: '', streetaddress: '', postcode: '', city: '', email: '', phone: ''})
    }

    return (
        <>
        <Button onClick={() => handleDialogOpen()}>Edit</Button>
        <Dialog 
            open={open}>
                <DialogTitle>Edit</DialogTitle>
                <DialogContent>
                    <TextField 
                        label='First name'
                        value={customer.firstname}
                        onChange={event => setCustomer({...customer, firstname: event.target.value})}
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField 
                        label='Last name'
                        value={customer.lastname}
                        onChange={event => setCustomer({...customer, lastname: event.target.value})}
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField 
                        label='Street address'
                        value={customer.streetaddress}
                        onChange={event => setCustomer({...customer, streetaddress: event.target.value})}
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField 
                        label='Postcode'
                        value={customer.postcode}
                        onChange={event => setCustomer({...customer, postcode: event.target.value})}
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField 
                        label='City'
                        value={customer.city}
                        onChange={event => setCustomer({...customer, city: event.target.value})}
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField 
                        label='Email'
                        value={customer.email}
                        onChange={event => setCustomer({...customer, email: event.target.value})}
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField 
                        label='Phone'
                        value={customer.phone}
                        onChange={event => setCustomer({...customer, phone: event.target.value})}
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleSave()}>Save</Button>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>
        </Dialog>
        </>
    )
}