import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface City {
   name: string;
   latitude: number;
   longitude: number;
}

interface SelectorUIProps {
   onCityChange: (coordinates: { latitude: number; longitude: number }, cityName: string) => void;
}

export default function SelectorUI({ onCityChange }: SelectorUIProps) {
   const [selectedCity, setSelectedCity] = useState<string>('quito');

   const cities: City[] = [
      { name: "Quito", latitude: -0.2298, longitude: -78.5249 },
      { name: "Guayaquil", latitude: -2.1894, longitude: -79.8890 },
      { name: "Cuenca", latitude: -2.9001, longitude: -79.0059 },
      { name: "Ambato", latitude: -1.2544, longitude: -78.6267 },
      { name: "Machala", latitude: -3.2581, longitude: -79.9553 },
      { name: "Loja", latitude: -3.9928, longitude: -79.2042 },
      { name: "Manta", latitude: -0.9537, longitude: -80.7324 },
      { name: "Portoviejo", latitude: -1.0548, longitude: -80.4558 },
      { name: "Esmeraldas", latitude: 0.9592, longitude: -79.6516 },
      { name: "Riobamba", latitude: -1.6635, longitude: -78.6547 }
   ];

   const handleCityChange = (event: { target: { value: string } }) => {
      const cityKey = event.target.value;
      const selectedCityData = cities.find(city =>
         city.name.toLowerCase().replace(/\s+/g, '') === cityKey
      );

      if (selectedCityData) {
         setSelectedCity(cityKey);
         onCityChange(
            {
               latitude: selectedCityData.latitude,
               longitude: selectedCityData.longitude
            },
            selectedCityData.name
         );
      }
   };

   return (
      <FormControl fullWidth>
         <InputLabel id="city-select-label">Seleccionar Ciudad</InputLabel>
         <Select
            labelId="city-select-label"
            id="city-select"
            value={selectedCity}
            label="Seleccionar Ciudad"
            onChange={handleCityChange}
         >
            {cities.map((city) => (
               <MenuItem
                  key={city.name}
                  value={city.name.toLowerCase().replace(/\s+/g, '')}
               >
                  {city.name}
               </MenuItem>
            ))}
         </Select>
      </FormControl>
   );
}