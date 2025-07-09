import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';

export default function SelectorUI() {

   const [cityInput, setCityInput] = useState<string>('');

   const handleChange = (event: SelectChangeEvent<string>) => {
      setCityInput(event.target.value);
   };

return (
   <FormControl fullWidth>
      <InputLabel id="city-select-label">Ciudad</InputLabel>
      <Select
         labelId="city-select-label"
         id="city-simple-select"
         label="Ciudad"
         value={cityInput}
         onChange={handleChange}>
         <MenuItem disabled><em>Seleccione una ciudad</em></MenuItem>
         <MenuItem value={"guayaquil"}>Guayaquil</MenuItem>
         <MenuItem value={"quito"}>Quito</MenuItem>
         <MenuItem value={"manta"}>Manta</MenuItem>
         <MenuItem value={"cuenca"}>Cuenca</MenuItem>
      </Select>

      {cityInput && (
         <p>
            Información del clima en <strong style={{textTransform: 'capitalize'}}>{cityInput}</strong>
         </p>
      )}

   </FormControl>
   )
}