import { Button, Grid, Stack, TextField } from '@mui/material';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';

function SearchToolbar({ children, onReset, onSubmit }) {
  return (
    <Grid alignItems="center" container spacing={1.5}>
      {children}
      <Grid size={{ xs: 12, md: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button fullWidth startIcon={<FilterAltRoundedIcon />} type="submit" variant="contained">
            Apply
          </Button>
          {onReset && (
            <Button onClick={onReset} startIcon={<RestartAltRoundedIcon />}>
              Clear
            </Button>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}

SearchToolbar.Field = TextField;

export default SearchToolbar;
