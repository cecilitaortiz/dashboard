import Typography from '@mui/material/Typography';
import { AppBar, Toolbar } from '@mui/material';

export default function HeaderUI() {
    return (
        <AppBar position="static" elevation={2}>
            <Toolbar sx={{ justifyContent: 'center' }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ fontWeight: 'bold', color: 'inherit' }}>
                    Dashboard del Clima
                </Typography>
            </Toolbar>
        </AppBar>
    )
}