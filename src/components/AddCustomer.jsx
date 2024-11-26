import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

export default function AddCustomer(props) {

    // Tilan hallinta
    const [open, setOpen] = useState(false); // Dialogin aukiolo
    const [customer, setCustomer] = useState({
        firstname: '', // Asiakkaan etunimi
        lastname: '', // Asiakkaan sukunimi
        streetaddress: '', // Asiakkaan katuosoite
        postcode: '', // Postinumero
        city: '', // Kaupunki
        email: '', // Sähköpostiosoite
        phone: '' // Puhelinnumero
    });

    // Tallentaa uuden asiakkaan ja nollaa lomakkeen
    const handleSave = () => {
        props.saveAddCustomer(customer); // Kutsuu ylätason funktiota, joka lisää asiakkaan
        setOpen(false); // Sulkee dialogin
        setCustomer({ // Nollaa asiakkaan tiedot
            firstname: '',
            lastname: '',
            streetaddress: '',
            postcode: '',
            city: '',
            email: '',
            phone: ''
        });
    };

    return (
        <>
            {/* Painike, joka avaa uuden asiakkaan lisäysdialogin */}
            <Button onClick={() => setOpen(true)}>Add Customer</Button>

            {/* Uuden asiakkaan lisäysdialogi */}
            <Dialog open={open}>
                <DialogTitle>
                    New Customer {/* Dialogin otsikko */}
                </DialogTitle>
                <DialogContent>
                    {/* Asiakkaan tietojen syöttökentät */}
                    <TextField
                        label="First name" // Etunimi
                        value={customer.firstname} // Tilan arvo
                        onChange={(event) =>
                            setCustomer({ ...customer, firstname: event.target.value })} // Päivittää tilan
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        label="Last name" // Sukunimi
                        value={customer.lastname} // Tilan arvo
                        onChange={(event) =>
                            setCustomer({ ...customer, lastname: event.target.value })} // Päivittää tilan
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        label="Street address" // Katuosoite
                        value={customer.streetaddress} // Tilan arvo
                        onChange={(event) =>
                            setCustomer({ ...customer, streetaddress: event.target.value })} // Päivittää tilan
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        label="Postcode" // Postinumero
                        value={customer.postcode} // Tilan arvo
                        onChange={(event) =>
                            setCustomer({ ...customer, postcode: event.target.value })} // Päivittää tilan
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        label="City" // Kaupunki
                        value={customer.city} // Tilan arvo
                        onChange={(event) =>
                            setCustomer({ ...customer, city: event.target.value })} // Päivittää tilan
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        label="Email" // Sähköpostiosoite
                        value={customer.email} // Tilan arvo
                        onChange={(event) =>
                            setCustomer({ ...customer, email: event.target.value })} // Päivittää tilan
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        label="Phone" // Puhelinnumero
                        value={customer.phone} // Tilan arvo
                        onChange={(event) =>
                            setCustomer({ ...customer, phone: event.target.value })} // Päivittää tilan
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    {/* Toimintopainikkeet */}
                    <Button onClick={() => handleSave()}>Save</Button> {/* Tallentaa asiakkaan */}
                    <Button onClick={() => setOpen(false)}>Close</Button> {/* Sulkee dialogin */}
                </DialogActions>
            </Dialog>
        </>
    );
}
