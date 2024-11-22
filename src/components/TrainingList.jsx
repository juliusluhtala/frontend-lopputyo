import { useEffect } from "react";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import dayjs from "dayjs";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

export default function TrainingList() {

    const [trainings, setTrainings] = useState([]);

    const [colDefs, setColDefs] = useState([
        {field: 'date', flex:1},
        {field: 'duration', flex:1},
        {field: 'activity', flex:1},
        {field: 'customerName', flex: 1}
    ]);

    useEffect(() => {getTrainings();}, []);

    const getTrainings = async () => {
        try {
            const response = await fetch(
                "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/gettrainings"
            );
            if (!response.ok) {
                throw new Error("Failed to fetch trainings");
            }

            const data = await response.json();

            // Format data to include customer name and formatted date
            const formattedData = data.map((training) => ({
                ...training,
                date: dayjs(training.date).format("DD.MM.YYYY HH:mm"),
                customerName: training.customer
                    ? `${training.customer.firstname} ${training.customer.lastname}`
                    : "Unknown",
            }));

            setTrainings(formattedData);
        } catch (error) {
            console.error("Error fetching trainings:", error);
        }
    };

    return (
        <>
            <div className="ag-theme-material" style={{ width: 900, height: 400 }}>
                <AgGridReact
                    rowData={trainings}
                    columnDefs={colDefs}
                    pagination={true}
                    paginationPageSize={5}
                    paginationPageSizeSelector={false}
                />
            </div>
        </>
    );
}
