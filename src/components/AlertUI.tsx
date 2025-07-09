import Alert from '@mui/material/Alert';
import type { AlertProps } from '@mui/material/Alert';

interface AlertConfig {
    description: string;
    variant?: AlertProps['variant'];
    severity?: AlertProps['severity'];
}

export default function AlertUI( config:AlertConfig ) {
    return (
        <Alert 
            variant={config.variant || "standard"} 
            severity={config.severity || "success"}
        > 
            {config.description} 
        </Alert>
    )
}