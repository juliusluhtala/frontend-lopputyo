import './App.css'
import Container from '@mui/material/Container';
import CustomerList from './components/CustomerList'
import TrainingList from './components/TrainingList'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CssBaseline } from '@mui/material';
import React, { useState } from 'react';

function App() {

  const [value, setValue] = useState(0);

  const handleTabChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
        <Container maxWidth="xl">
        <CssBaseline/>
        <div style={{ width: '100%' }}>
        <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" centered>
            <Tab label="Training" />
            <Tab label="Customer" />
        </Tabs>

        {value === 0 && (
            <div style={{ padding: '20px' }}>
            <TrainingList/>
            </div>
        )}

        {value === 1 && (
            <div style={{ padding: '20px' }}>
            <CustomerList/>
            </div>
        )}
        </div>
    </Container>
    );
  }

export default App
