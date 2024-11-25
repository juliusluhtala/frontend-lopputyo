import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

export default function AddCustomer(props)  {

    const [open, setOpen] = useState(false);
    const [customer, setCustomer] = useState({firstname: '', lastname: '', streetaddress: '', postcode: '', city: '', email: '', phone: ''});

    const handleSave = () => {
        props.saveAddCustomer(customer);
        setOpen(false);
        setCustomer({firstname: '', lastname: '', streetaddress: '', postcode: '', city: '', email: '', phone: ''})
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>Add Customer</Button>
            <Dialog 
                open={open}>
                <DialogTitle> 
                    New Customer
                </DialogTitle>
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
    );
}