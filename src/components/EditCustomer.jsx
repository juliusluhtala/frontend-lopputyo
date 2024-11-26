import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

export default function EditCustomer(props) {
    const { params, saveEditCustomer } = props; // Puretaan propsit: asiakkaan tiedot ja tallennusfunktio
    const { data } = params; // Haetaan asiakastiedot parametreista

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

    // Avaa dialogin ja alustaa asiakkaan tiedot lomakkeeseen
    const handleDialogOpen = () => {
        console.log(props.params.data); // Debug-loki asiakkaan tiedoista
        setCustomer({   // Alustaa lomakkeen kentät
            firstname: props.params.data.firstname,
            lastname: props.params.data.lastname,
            streetaddress: props.params.data.streetaddress,
            postcode: props.params.data.postcode,
            city: props.params.data.city,
            email: props.params.data.email,
            phone: props.params.data.phone
        });
        setOpen(true); // Avaa dialogin
    };

    // Tallentaa muokatun asiakkaan tiedot
    const handleSave = () => {
        // Hakee asiakkaan ID:n linkistä
        const id = props.params.data._links.customer.href.split('/').pop();
        console.log(id); // Debug-loki ID:stä
        if (!id) {
            console.error('Customer ID is missing'); // Varmistetaan, että ID on olemassa
            return;
        }
        props.saveEditCustomer(customer, id); // Kutsuu ylätason tallennusfunktiota
        setOpen(false); // Sulkee dialogin
        setCustomer({   // Nollaa lomakkeen tiedot
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
            {/* Painike, joka avaa muokkausdialogin */}
            <Button onClick={() => handleDialogOpen()}>Edit</Button>

            {/* Muokkausdialogi */}
            <Dialog open={open}>
                <DialogTitle>Edit</DialogTitle> {/* Dialogin otsikko */}
                <DialogContent>
                    {/* Asiakkaan tietojen muokkauskentät */}
                    <TextField
                        label="First name" // Etunimi
                        value={customer.firstname} // Kentän arvo tilasta
                        onChange={(event) =>
                            setCustomer({ ...customer, firstname: event.target.value })} // Päivittää tilan
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        label="Last name" // Sukunimi
                        value={customer.lastname}
                        onChange={(event) =>
                            setCustomer({ ...customer, lastname: event.target.value })}
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        label="Street address" // Katuosoite
                        value={customer.streetaddress}
                        onChange={(event) =>
                            setCustomer({ ...customer, streetaddress: event.target.value })}
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        label="Postcode" // Postinumero
                        value={customer.postcode}
                        onChange={(event) =>
                            setCustomer({ ...customer, postcode: event.target.value })}
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        label="City" // Kaupunki
                        value={customer.city}
                        onChange={(event) =>
                            setCustomer({ ...customer, city: event.target.value })}
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        label="Email" // Sähköpostiosoite
                        value={customer.email}
                        onChange={(event) =>
                            setCustomer({ ...customer, email: event.target.value })}
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        label="Phone" // Puhelinnumero
                        value={customer.phone}
                        onChange={(event) =>
                            setCustomer({ ...customer, phone: event.target.value })}
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    {/* Toimintopainikkeet */}
                    <Button onClick={() => handleSave()}>Save</Button> {/* Tallentaa muutokset */}
                    <Button onClick={() => setOpen(false)}>Close</Button> {/* Sulkee dialogin */}
                </DialogActions>
            </Dialog>
        </>
    );
}
