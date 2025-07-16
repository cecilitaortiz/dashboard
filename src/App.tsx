import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import DataFetcher from './functions/DataFetcher';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';
import CohereAssistantUI from './components/CohereAssistantUI';
import './App.css'
//npnimport React from 'react';
import { Grid, Typography, CircularProgress } from '@mui/material';
import { useState } from 'react';

function App() {
  const [coordinates, setCoordinates] = useState({ 
    latitude: -0.2298, 
    longitude: -78.5249 
  });
  
  const [selectedCityName, setSelectedCityName] = useState<string>('Quito');

  const { data, loading, error } = DataFetcher(coordinates);

  const handleCityChange = (newCoordinates: { latitude: number; longitude: number }, cityName: string) => {
    setCoordinates(newCoordinates);
    setSelectedCityName(cityName);
    console.log(`Ciudad seleccionada: ${cityName}`, newCoordinates); // Para debug
  };

  return (
    <Grid container spacing={5} justifyContent="center" alignItems="center">

      {/* Encabezado */}
      <Grid size={{ xs: 12, md: 12 }}>
        <HeaderUI />
      </Grid>

      {/* Alertas */}
      <Grid container justifyContent="right" alignItems="center">
        <AlertUI description="No se preveen lluvias" />
      </Grid>

      {/* Selector */}
      <Grid size={{ xs: 12, md: 3 }}>
        <SelectorUI onCityChange={handleCityChange} />
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          Ciudad actual: {selectedCityName}
        </Typography>
      </Grid>

      {/* Indicadores */}
      <Grid container size={{ xs: 12, md: 9 }} >

        {/* Mostrar estado de carga */}
        {loading && (
          <Grid size={{ xs: 12 }} textAlign="center">
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando datos del clima para {selectedCityName}...
            </Typography>
          </Grid>
        )}

        {/* Mostrar error si existe */}
        {error && !loading && (
          <Grid size={{ xs: 12 }} textAlign="center">
            <Typography variant="h6" color="error">
              Error al cargar datos para {selectedCityName}: {error}
            </Typography>
          </Grid>
        )}

        {/* Mostrar datos si están disponibles */}
        {data && !loading && !error && (
          <>
            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI
                title='Temperatura (2m)'
              description={data.current?.temperature_2m ? `${data.current.temperature_2m}°C` : '--°C'} 
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI
                title='Temperatura aparente'
              description={data.current?.apparent_temperature ? `${data.current.apparent_temperature}°C` : '--°C'} 
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI
                title='Velocidad del viento'
              description={data.current?.wind_speed_10m ? `${data.current.wind_speed_10m}km/h` : '--km/h'} 
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI
                title='Humedad relativa'
              description={data.current?.relative_humidity_2m ? `${data.current.relative_humidity_2m}%` : '--%'} 
              />
            </Grid>
          </>
        )}

        {/* Fallback: mostrar indicadores vacíos si no hay datos */}
        {!data && !loading && !error && (
          <>
            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI title='Temperatura (2m)' description='--°C' />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI title='Temperatura aparente' description='--°C' />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI title='Velocidad del viento' description='--km/h' />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI title='Humedad relativa' description='--%' />
            </Grid>
          </>
        )}

      </Grid>

      {/* Gráfico */}
      <Grid
        sx={{ display: { xs: "none", md: "block" } }} >
        <ChartUI data={data} />
      </Grid>

      {/* Tabla */}
      <Grid sx={{ display: { xs: "none", md: "block" } }}>
        <TableUI data={data} />
      </Grid>

      {/* Información adicional */}
      <Grid>
        <Typography variant="body1">
          Mostrando datos del clima para: {selectedCityName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lat: {coordinates.latitude.toFixed(4)}, Lon: {coordinates.longitude.toFixed(4)}
        </Typography>
      </Grid>

      {/* Cohere Assistant - Movido al final y más pequeño */}
      <Grid size={{ xs: 12, md: 4 }}>
        <CohereAssistantUI 
          weatherData={data} 
          cityName={selectedCityName}
          coordinates={coordinates}
        />
      </Grid>

    </Grid>
  );
}

export default App;
