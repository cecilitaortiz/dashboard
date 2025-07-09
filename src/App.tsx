import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import DataFetcher from './functions/DataFetcher';

import './App.css'
//npnimport React from 'react';
import { Grid, Typography, CircularProgress } from '@mui/material';

function App() {
  const dataFetcherOutput = DataFetcher();

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
        <SelectorUI />
      </Grid>

      {/* Indicadores */}
      <Grid container size={{ xs: 12, md: 9 }} >

        {/* Mostrar estado de carga */}
        {dataFetcherOutput.loading && (
          <Grid size={{ xs: 12 }} textAlign="center">
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando datos del clima...
            </Typography>
          </Grid>
        )}

        {/* Mostrar error si existe */}
        {dataFetcherOutput.error && !dataFetcherOutput.loading && (
          <Grid size={{ xs: 12 }} textAlign="center">
            <Typography variant="h6" color="error">
              Error: {dataFetcherOutput.error}
            </Typography>
          </Grid>
        )}

        {/* Mostrar datos si están disponibles */}
        {dataFetcherOutput.data && !dataFetcherOutput.loading && !dataFetcherOutput.error && (
          <>
            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI 
                title='Temperatura (2m)' 
               // description={dataFetcherOutput.data.current?.temperature_2m ? `${dataFetcherOutput.data.current.temperature_2m}°C` : '--°C'} 
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI 
                title='Temperatura aparente' 
               // description={dataFetcherOutput.data.current?.apparent_temperature ? `${dataFetcherOutput.data.current.apparent_temperature}°C` : '--°C'} 
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI 
                title='Velocidad del viento' 
                //description={dataFetcherOutput.data.current?.wind_speed_10m ? `${dataFetcherOutput.data.current.wind_speed_10m}km/h` : '--km/h'} 
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI 
                title='Humedad relativa' 
                //description={dataFetcherOutput.data.current?.relative_humidity_2m ? `${dataFetcherOutput.data.current.relative_humidity_2m}%` : '--%'} 
              />
            </Grid>
          </>
        )}

        {/* Fallback: mostrar indicadores vacíos si no hay datos */}
        {!dataFetcherOutput.data && !dataFetcherOutput.loading && !dataFetcherOutput.error && (
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
        Elemento: Gráfico
      </Grid>

      {/* Tabla */}
      <Grid sx={{ display: { xs: "none", md: "block" } }}>
        Elemento: Tabla
      </Grid>

      {/* Información adicional */}
      <Grid>Elemento: Información adicional</Grid>

    </Grid>
  );
}

export default App;
