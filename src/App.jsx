import './App.css';
import Container from '@mui/material/Container';
import CustomerList from './components/CustomerList';
import TrainingList from './components/TrainingList';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CssBaseline } from '@mui/material';
import React, { useState } from 'react';

function App() {
    // Tilan hallinta aktiivisen välilehden valitsemiseksi
    const [value, setValue] = useState(0); // `value` pitää kirjaa aktiivisesta välilehdestä

    // Välilehden vaihtamisen käsittelijä
    const handleTabChange = (event, newValue) => {
        setValue(newValue); // Päivittää aktiivisen välilehden arvon
    };

    return (
        <Container maxWidth="xl">
            <CssBaseline />
            
            <div style={{ width: '100%' }}>
                {/* Välilehdet komponenttien vaihtamiseksi */}
                <Tabs 
                    value={value} // Aktiivinen välilehti
                    onChange={handleTabChange} // Funktio, joka vaihtaa aktiivista välilehteä
                    aria-label="basic tabs example"
                    centered 
                >
                    <Tab label="Training" /> {/* Harjoituslistan välilehti */}
                    <Tab label="Customer" /> {/* Asiakaslistan välilehti */}
                </Tabs>

                {/* Renderöi sisältöä aktiivisen välilehden perusteella */}
                {value === 0 && ( // Näytetään Harjoituslista, jos aktiivinen välilehti on 0
                    <div style={{ padding: '20px' }}>
                        <TrainingList /> {/* Harjoituslista-komponentti */}
                    </div>
                )}

                {value === 1 && ( // Näytetään Asiakaslista, jos aktiivinen välilehti on 1
                    <div style={{ padding: '20px' }}>
                        <CustomerList /> {/* Asiakaslista-komponentti */}
                    </div>
                )}
            </div>
        </Container>
    );
}

export default App; // Vie `App`-komponentin