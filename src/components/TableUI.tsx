import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface TableUIProps {
   data: OpenMeteoResponse | null;
}

function createWeatherTableData(data: OpenMeteoResponse | null) {
   if (!data || !data.hourly) {
      return [];
   }

   // Tomar solo las primeras 10 horas para la tabla
   const maxRows = Math.min(10, data.hourly.time.length);
   
   return Array.from({ length: maxRows }, (_, index) => ({
      id: index,
      time: new Date(data.hourly.time[index]).toLocaleString('es-ES', {
         hour: '2-digit',
         minute: '2-digit',
         day: '2-digit',
         month: '2-digit'
      }),
      temperature: data.hourly.temperature_2m[index],
      humidity: data.hourly.relative_humidity_2m[index],
      windSpeed: data.hourly.wind_speed_10m[index],
      apparentTemp: data.hourly.apparent_temperature[index]
   }));
}

const columns: GridColDef[] = [
   { field: 'id', headerName: 'ID', width: 70 },
   {
      field: 'time',
      headerName: 'Hora',
      width: 120,
   },
   {
      field: 'temperature',
      headerName: 'Temperatura (°C)',
      width: 150,
      type: 'number',
   },
   {
      field: 'humidity',
      headerName: 'Humedad (%)',
      width: 120,
      type: 'number',
   },
   {
      field: 'windSpeed',
      headerName: 'Viento (km/h)',
      width: 130,
      type: 'number',
   },
   {
      field: 'apparentTemp',
      headerName: 'Sensación (°C)',
      width: 140,
      type: 'number',
   },
];

export default function TableUI({ data }: TableUIProps) {

   const rows = createWeatherTableData(data);

   return (
      <Box sx={{ height: 350, width: '100%' }}>
         <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
               pagination: {
                  paginationModel: {
                     pageSize: 5,
                  },
               },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
         />
      </Box>
   );
}