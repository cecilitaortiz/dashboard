import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface ChartUIProps {
   data: OpenMeteoResponse | null;
}

function createChartData(data: OpenMeteoResponse | null) {
   if (!data || !data.hourly) {
      return {
         temperatures: [],
         humidity: [],
         windSpeed: [],
         labels: []
      };
   }

   // Tomar solo las primeras 12 horas para el gráfico
   const maxPoints = Math.min(12, data.hourly.time.length);
   
   return {
     temperatures: data.hourly.temperature_2m.slice(0, maxPoints),
     humidity: data.hourly.relative_humidity_2m.slice(0, maxPoints),
     windSpeed: data.hourly.wind_speed_10m.slice(0, maxPoints),
     labels: data.hourly.time.slice(0, maxPoints).map(time => 
       new Date(time).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' })
     )
   };
}

export default function ChartUI({ data }: ChartUIProps) {
   const chartData = createChartData(data);
   
   return (
      <>
         <Typography variant="h5" component="div">
            Datos Meteorológicos por Hora
         </Typography>
         <LineChart
            height={300}
            series={[
               { data: chartData.temperatures, label: 'Temperatura (°C)', color: '#ff6b6b'},
               { data: chartData.humidity, label: 'Humedad (%)', color: '#4ecdc4'},
               { data: chartData.windSpeed, label: 'Viento (km/h)', color: '#45b7d1'},
            ]}
            xAxis={[{ scaleType: 'point', data: chartData.labels }]}
         />
      </>
   );
}