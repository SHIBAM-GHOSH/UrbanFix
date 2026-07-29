import { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';

const emptyComplaint = {
  category: '',
  description: '',
  latitude: '',
  location: '',
  longitude: '',
  title: '',
};

function ComplaintForm({ initialValues = emptyComplaint, isSubmitting, onSubmit, submitLabel }) {
  const [values, setValues] = useState({
    ...emptyComplaint,
    category: initialValues.category || '',
    description: initialValues.description || '',
    imageUrl: initialValues.imageUrl,
    latitude: initialValues.latitude ?? '',
    location: initialValues.location || '',
    longitude: initialValues.longitude ?? '',
    title: initialValues.title || '',
  });
  const [image, setImage] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  function handleImageChange(event) {
    setImage(event.target.files?.[0] || null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      ...values,
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      image,
    });
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <TextField autoFocus fullWidth label="Issue title" name="title" onChange={handleChange} placeholder="e.g. Large pothole near the market" required value={values.title} />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField fullWidth label="Category" name="category" onChange={handleChange} placeholder="e.g. Roads" required value={values.category} />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth label="Detailed description" minRows={5} multiline name="description" onChange={handleChange} placeholder="Describe the issue, its impact, and any details that will help the response team." required value={values.description} />
          </Grid>
          <Grid size={12}>
            <TextField fullWidth label="Location" name="location" onChange={handleChange} placeholder="Street, landmark, or area" required value={values.location} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth inputProps={{ step: 'any' }} label="Latitude" name="latitude" onChange={handleChange} required type="number" value={values.latitude} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth inputProps={{ step: 'any' }} label="Longitude" name="longitude" onChange={handleChange} required type="number" value={values.longitude} />
          </Grid>
        </Grid>

        <Box>
          <Typography gutterBottom fontWeight={700} variant="body2">
            Photo evidence <Typography color="text.secondary" component="span" variant="inherit">(optional)</Typography>
          </Typography>
          <Button component="label" startIcon={<CloudUploadRoundedIcon />} variant="outlined">
            {image ? image.name : 'Upload a photo'}
            <input accept="image/*" hidden onChange={handleImageChange} type="file" />
          </Button>
        </Box>

        <Button disabled={isSubmitting} size="large" type="submit" variant="contained">
          {isSubmitting ? 'Saving complaint…' : submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}

export default ComplaintForm;
