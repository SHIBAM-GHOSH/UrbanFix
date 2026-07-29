import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const emptyComplaint = {
  category: '',
  description: '',
  latitude: '',
  location: '',
  longitude: '',
  title: '',
};

function validateComplaint(values, image) {
  const errors = {};

  if (!values.title.trim()) errors.title = 'Issue title is required.';
  if (!values.category.trim()) errors.category = 'Category is required.';
  if (!values.description.trim()) errors.description = 'Description is required.';
  if (!values.location.trim()) errors.location = 'Location is required.';

  if (values.latitude === '' || Number.isNaN(Number(values.latitude))) {
    errors.latitude = 'Valid latitude is required.';
  } else if (Number(values.latitude) < -90 || Number(values.latitude) > 90) {
    errors.latitude = 'Latitude must be between -90 and 90.';
  }

  if (values.longitude === '' || Number.isNaN(Number(values.longitude))) {
    errors.longitude = 'Valid longitude is required.';
  } else if (Number(values.longitude) < -180 || Number(values.longitude) > 180) {
    errors.longitude = 'Longitude must be between -180 and 180.';
  }

  if (image && !image.type.startsWith('image/')) {
    errors.image = 'Please upload a valid image file.';
  } else if (image && image.size > MAX_IMAGE_SIZE) {
    errors.image = 'Image size must be under 5 MB.';
  }

  return errors;
}

function ComplaintForm({ initialValues = emptyComplaint, isSubmitting, onSubmit, submitLabel }) {
  const [values, setValues] = useState({
    ...emptyComplaint,
    category: initialValues.category || '',
    description: initialValues.description || '',
    imageUrl: initialValues.imageUrl || '',
    latitude: initialValues.latitude ?? '',
    location: initialValues.location || '',
    longitude: initialValues.longitude ?? '',
    title: initialValues.title || '',
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  const previewUrl = useMemo(() => {
    if (image) return URL.createObjectURL(image);
    return values.imageUrl || '';
  }, [image, values.imageUrl]);

  useEffect(() => () => {
    if (image && previewUrl) URL.revokeObjectURL(previewUrl);
  }, [image, previewUrl]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }));
  }

  function selectImage(file) {
    const nextImage = file || null;
    const nextErrors = validateComplaint(values, nextImage);

    setImage(nextImage);
    setErrors((currentErrors) => ({ ...currentErrors, image: nextErrors.image || '' }));
  }

  function handleImageChange(event) {
    selectImage(event.target.files?.[0]);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    selectImage(event.dataTransfer.files?.[0]);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateComplaint(values, image);
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    onSubmit({
      category: values.category.trim(),
      description: values.description.trim(),
      image,
      imageUrl: values.imageUrl || undefined,
      latitude: Number(values.latitude),
      location: values.location.trim(),
      longitude: Number(values.longitude),
      title: values.title.trim(),
    });
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <TextField
              autoFocus
              error={Boolean(errors.title)}
              fullWidth
              helperText={errors.title}
              label="Issue title"
              name="title"
              onChange={handleChange}
              placeholder="e.g. Large pothole near the market"
              required
              value={values.title}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              error={Boolean(errors.category)}
              fullWidth
              helperText={errors.category}
              label="Category"
              name="category"
              onChange={handleChange}
              placeholder="e.g. Roads"
              required
              value={values.category}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              error={Boolean(errors.description)}
              fullWidth
              helperText={errors.description || 'Mention impact, nearby landmark, and urgency.'}
              label="Detailed description"
              minRows={5}
              multiline
              name="description"
              onChange={handleChange}
              placeholder="Describe the issue, its impact, and any details that will help the response team."
              required
              value={values.description}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              error={Boolean(errors.location)}
              fullWidth
              helperText={errors.location}
              label="Location"
              name="location"
              onChange={handleChange}
              placeholder="Street, landmark, or area"
              required
              value={values.location}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              error={Boolean(errors.latitude)}
              fullWidth
              helperText={errors.latitude}
              inputProps={{ step: 'any' }}
              label="Latitude"
              name="latitude"
              onChange={handleChange}
              required
              type="number"
              value={values.latitude}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              error={Boolean(errors.longitude)}
              fullWidth
              helperText={errors.longitude}
              inputProps={{ step: 'any' }}
              label="Longitude"
              name="longitude"
              onChange={handleChange}
              required
              type="number"
              value={values.longitude}
            />
          </Grid>
        </Grid>

        <Stack spacing={1.5}>
          <Typography fontWeight={800} variant="body2">
            Photo evidence <Typography color="text.secondary" component="span" variant="inherit">(optional)</Typography>
          </Typography>
          <Box
            onDragLeave={() => setIsDragging(false)}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDrop={handleDrop}
            sx={{
              alignItems: 'center',
              border: '1px dashed',
              borderColor: errors.image ? 'error.main' : isDragging ? 'primary.main' : 'divider',
              borderRadius: 2,
              bgcolor: isDragging ? 'primary.light' : 'background.default',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              p: 2,
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'flex',
                height: 132,
                justifyContent: 'center',
                overflow: 'hidden',
                width: { xs: '100%', sm: 180 },
              }}
            >
              {previewUrl ? (
                <Box alt="Complaint preview" component="img" src={previewUrl} sx={{ height: '100%', objectFit: 'cover', width: '100%' }} />
              ) : (
                <ImageRoundedIcon color="disabled" sx={{ fontSize: 48 }} />
              )}
            </Box>

            <Stack flex={1} spacing={1}>
              <Typography fontWeight={800}>
                Drag and drop an image here
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Upload JPG, PNG, or WebP evidence up to 5 MB.
              </Typography>
              <Stack alignItems="center" direction="row" flexWrap="wrap" gap={1}>
                <Button component="label" startIcon={<CloudUploadRoundedIcon />} variant="outlined">
                  Choose photo
                  <input accept="image/*" hidden onChange={handleImageChange} type="file" />
                </Button>
                {image && <Chip label={image.name} />}
                {(image || values.imageUrl) && (
                  <IconButton aria-label="Remove selected image" color="error" onClick={() => selectImage(null)}>
                    <CloseRoundedIcon />
                  </IconButton>
                )}
              </Stack>
            </Stack>
          </Box>
          {errors.image && <Alert severity="error">{errors.image}</Alert>}
        </Stack>

        <Button disabled={isSubmitting} size="large" type="submit" variant="contained">
          {isSubmitting ? 'Saving complaint...' : submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}

export default ComplaintForm;
