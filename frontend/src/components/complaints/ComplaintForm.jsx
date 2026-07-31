import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocationPickerMap from '../maps/LocationPickerMap';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const CATEGORY_SUGGESTIONS = [
  'Roads & Traffic',
  'Sanitation & Waste',
  'Water Supply',
  'Electrical & Lighting',
  'Public Parks',
  'Noise & Pollution',
  'Other',
];

const emptyComplaint = {
  category: '',
  description: '',
  imageUrl: '',
  latitude: '',
  location: '',
  longitude: '',
  title: '',
};

function validateComplaint(values, image, allowImageUpload) {
  const errors = {};

  if (!values.title.trim()) errors.title = 'Issue title is required.';
  if (!values.category.trim()) errors.category = 'Category is required.';
  if (!values.description.trim()) errors.description = 'Description is required.';
  if (!values.location.trim()) errors.location = 'Location is required.';

  if (values.latitude === '' || values.latitude === null || Number.isNaN(Number(values.latitude))) {
    errors.latitude = 'Valid latitude is required.';
  } else if (Number(values.latitude) < -90 || Number(values.latitude) > 90) {
    errors.latitude = 'Latitude must be between -90 and 90.';
  }

  if (values.longitude === '' || values.longitude === null || Number.isNaN(Number(values.longitude))) {
    errors.longitude = 'Valid longitude is required.';
  } else if (Number(values.longitude) < -180 || Number(values.longitude) > 180) {
    errors.longitude = 'Longitude must be between -180 and 180.';
  }

  if (allowImageUpload && image) {
    if (!image.type.startsWith('image/')) {
      errors.image = 'Please upload a valid image file.';
    } else if (image.size > MAX_IMAGE_SIZE) {
      errors.image = 'Image size must be under 5 MB.';
    }
  }

  return errors;
}

function ComplaintForm({
  allowImageUpload = true,
  cancelLabel = 'Cancel',
  initialValues = emptyComplaint,
  isSubmitting,
  onCancel,
  onSubmit,
  submitLabel = 'Submit Complaint',
  onDirtyChange,
}) {
  const [values, setValues] = useState({
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
  const [geoLoading, setGeoLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const previewUrl = useMemo(() => {
    if (image) return URL.createObjectURL(image);
    return values.imageUrl || '';
  }, [image, values.imageUrl]);

  useEffect(() => () => {
    if (image && previewUrl) URL.revokeObjectURL(previewUrl);
  }, [image, previewUrl]);

  // Sync state if initialValues changes (e.g. on load)
  useEffect(() => {
    if (initialValues) {
      setValues({
        category: initialValues.category || '',
        description: initialValues.description || '',
        imageUrl: initialValues.imageUrl || '',
        latitude: initialValues.latitude ?? '',
        location: initialValues.location || '',
        longitude: initialValues.longitude ?? '',
        title: initialValues.title || '',
      });
    }
  }, [initialValues]);

  // Track whether form is dirty
  const isDirty = useMemo(() => {
    if (image) return true;
    return (
      (values.title || '') !== (initialValues.category ? initialValues.title || '' : '') ||
      (values.category || '') !== (initialValues.category || '') ||
      (values.description || '') !== (initialValues.description || '') ||
      (values.location || '') !== (initialValues.location || '') ||
      String(values.latitude ?? '') !== String(initialValues.latitude ?? '') ||
      String(values.longitude ?? '') !== String(initialValues.longitude ?? '') ||
      (values.imageUrl || '') !== (initialValues.imageUrl || '')
    );
  }, [values, image, initialValues]);

  useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(isDirty);
    }
  }, [isDirty, onDirtyChange]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const currentErrors = validateComplaint(values, image, allowImageUpload);
    if (currentErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: currentErrors[name] }));
    }
  }

  function handleCategorySelect(cat) {
    setValues((prev) => ({ ...prev, category: cat }));
    setErrors((prev) => ({ ...prev, category: '' }));
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      setErrors((prev) => ({ ...prev, location: 'Geolocation is not supported by your browser.' }));
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        setValues((prev) => ({
          ...prev,
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
        }));
        setErrors((prev) => ({ ...prev, latitude: '', longitude: '' }));
      },
      (error) => {
        setGeoLoading(false);
        setErrors((prev) => ({
          ...prev,
          location: `Geolocation error: ${error.message || 'Unable to retrieve location.'}`,
        }));
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  }

  function selectImage(file) {
    if (!allowImageUpload) return;
    const nextImage = file || null;
    const nextErrors = validateComplaint(values, nextImage, allowImageUpload);
    setImage(nextImage);
    setErrors((prev) => ({ ...prev, image: nextErrors.image || '' }));
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
    const nextErrors = validateComplaint(values, image, allowImageUpload);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      category: values.category.trim(),
      description: values.description.trim(),
      image,
      imageUrl: values.imageUrl ? values.imageUrl.trim() : undefined,
      latitude: Number(values.latitude),
      location: values.location.trim(),
      longitude: Number(values.longitude),
      title: values.title.trim(),
    });
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Grid container spacing={2.5}>
          {/* Issue Title */}
          <Grid size={{ xs: 12, md: 7 }}>
            <TextField
              autoFocus
              error={Boolean(errors.title && (touched.title || Object.keys(errors).length > 0))}
              fullWidth
              helperText={errors.title || 'Clear, concise title summarizing the civic issue.'}
              label="Issue Title"
              name="title"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="e.g. Large pothole near the market"
              required
              value={values.title}
            />
          </Grid>

          {/* Category */}
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              error={Boolean(errors.category && (touched.category || Object.keys(errors).length > 0))}
              fullWidth
              helperText={errors.category || 'Select or type a category.'}
              label="Category"
              name="category"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="e.g. Roads & Traffic"
              required
              value={values.category}
            />
          </Grid>

          {/* Category Suggestions */}
          <Grid size={12}>
            <Stack alignItems="center" direction="row" flexWrap="wrap" gap={1}>
              <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, mr: 0.5 }}>
                Quick Categories:
              </Typography>
              {CATEGORY_SUGGESTIONS.map((cat) => (
                <Chip
                  key={cat}
                  color={values.category.toLowerCase() === cat.toLowerCase() ? 'primary' : 'default'}
                  label={cat}
                  onClick={() => handleCategorySelect(cat)}
                  size="small"
                  variant={values.category.toLowerCase() === cat.toLowerCase() ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer', fontWeight: 600 }}
                />
              ))}
            </Stack>
          </Grid>

          {/* Description */}
          <Grid size={12}>
            <TextField
              error={Boolean(errors.description && (touched.description || Object.keys(errors).length > 0))}
              fullWidth
              helperText={errors.description || 'Describe the issue, impact, and specific location markers.'}
              label="Detailed Description"
              minRows={4}
              multiline
              name="description"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Provide details that will assist field workers in locating and fixing the issue."
              required
              value={values.description}
            />
          </Grid>

          {/* Location text */}
          <Grid size={12}>
            <TextField
              error={Boolean(errors.location && (touched.location || Object.keys(errors).length > 0))}
              fullWidth
              helperText={errors.location || 'Street name, landmark, or area description.'}
              label="Location Address / Landmark"
              name="location"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="e.g. 123 Main St, Near Central Market"
              required
              value={values.location}
            />
          </Grid>

          {/* Coordinates & Google Map Picker Header */}
          <Grid size={12}>
            <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={1} sx={{ mb: 1 }}>
              <Typography color="text.secondary" fontWeight={700} variant="caption">
                GEOGRAPHIC LOCATION & GPS MAP PICKER
              </Typography>
              <Button
                disabled={geoLoading}
                onClick={handleUseCurrentLocation}
                size="small"
                startIcon={<MyLocationRoundedIcon />}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              >
                {geoLoading ? 'Acquiring location...' : 'Use Current GPS'}
              </Button>
            </Stack>

            <LocationPickerMap
              latitude={values.latitude}
              longitude={values.longitude}
              onLocationSelect={({ latitude: newLat, longitude: newLng, address }) => {
                setValues((prev) => ({
                  ...prev,
                  latitude: newLat,
                  longitude: newLng,
                  location: address || prev.location,
                }));
                setErrors((prev) => ({
                  ...prev,
                  latitude: '',
                  longitude: '',
                  location: address ? '' : prev.location,
                }));
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              error={Boolean(errors.latitude && (touched.latitude || Object.keys(errors).length > 0))}
              fullWidth
              helperText={errors.latitude || 'Range: -90.0 to 90.0'}
              inputProps={{ step: 'any' }}
              label="Latitude"
              name="latitude"
              onBlur={handleBlur}
              onChange={handleChange}
              required
              type="number"
              value={values.latitude}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              error={Boolean(errors.longitude && (touched.longitude || Object.keys(errors).length > 0))}
              fullWidth
              helperText={errors.longitude || 'Range: -180.0 to 180.0'}
              inputProps={{ step: 'any' }}
              label="Longitude"
              name="longitude"
              onBlur={handleBlur}
              onChange={handleChange}
              required
              type="number"
              value={values.longitude}
            />
          </Grid>
        </Grid>

        {/* Photo Evidence / Image section */}
        <Stack spacing={1.5}>
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography fontWeight={800} variant="body2">
              Photo Evidence / Image URL
            </Typography>
            <Tooltip title="Images help municipal teams assess severity quickly.">
              <InfoOutlinedIcon color="action" sx={{ fontSize: 18 }} />
            </Tooltip>
          </Stack>

          {!allowImageUpload && (
            <Alert severity="info" icon={<InfoOutlinedIcon />}>
              <Typography variant="body2" fontWeight={600}>
                Image file re-upload is restricted during edit.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                The current backend update endpoint accepts an Image URL or retains the existing photo. You can update or clear the Image URL below.
              </Typography>
            </Alert>
          )}

          {!allowImageUpload && (
            <TextField
              fullWidth
              helperText="Optional direct link to photo evidence."
              label="Image URL"
              name="imageUrl"
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              size="small"
              value={values.imageUrl}
              InputProps={{
                endAdornment: values.imageUrl ? (
                  <InputAdornment position="end">
                    <IconButton edge="end" size="small" onClick={() => setValues((prev) => ({ ...prev, imageUrl: '' }))}>
                      <CloseRoundedIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          )}

          {allowImageUpload && (
            <Box
              onDragLeave={() => setIsDragging(false)}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDrop={handleDrop}
              sx={{
                alignItems: 'center',
                border: '2px dashed',
                borderColor: errors.image ? 'error.main' : isDragging ? 'primary.main' : 'divider',
                borderRadius: 3,
                bgcolor: isDragging ? 'primary.light' : 'background.default',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2.5,
                p: 2.5,
                transition: 'all 0.2s ease-in-out',
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
                  height: 120,
                  justifyContent: 'center',
                  overflow: 'hidden',
                  width: { xs: '100%', sm: 160 },
                  flexShrink: 0,
                }}
              >
                {previewUrl ? (
                  <Box alt="Complaint preview" component="img" src={previewUrl} sx={{ height: '100%', objectFit: 'cover', width: '100%' }} />
                ) : (
                  <ImageRoundedIcon color="disabled" sx={{ fontSize: 44 }} />
                )}
              </Box>

              <Stack flex={1} spacing={1}>
                <Typography fontWeight={700} variant="body2">
                  Drag & drop your photo evidence here
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  Supports JPG, PNG, or WebP up to 5 MB.
                </Typography>
                <Stack alignItems="center" direction="row" flexWrap="wrap" gap={1}>
                  <Button component="label" startIcon={<CloudUploadRoundedIcon />} variant="outlined" size="small">
                    Select File
                    <input accept="image/*" hidden onChange={handleImageChange} type="file" />
                  </Button>
                  {image && <Chip label={image.name} color="primary" size="small" onDelete={() => selectImage(null)} />}
                  {!image && values.imageUrl && (
                    <Chip label="Existing Image Attached" color="success" size="small" variant="outlined" />
                  )}
                </Stack>
              </Stack>
            </Box>
          )}

          {errors.image && <Alert severity="error">{errors.image}</Alert>}
        </Stack>

        {/* Live Preview Card */}
        {(values.title || values.description || previewUrl) && (
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: 'grey.50',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="overline" color="text.secondary" fontWeight={900}>
              Live Form Preview
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              {previewUrl && (
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Preview"
                  sx={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 2 }}
                />
              )}
              <Typography variant="h6" fontWeight={800}>
                {values.title || 'Untitled Complaint'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {values.description || 'No description provided yet.'}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                {values.category && <Chip label={values.category} size="small" color="primary" />}
                {values.location && (
                  <Chip
                    label={values.location}
                    size="small"
                    variant="outlined"
                  />
                )}
                {values.latitude && values.longitude && (
                  <Chip
                    icon={<CheckCircleOutlineIcon fontSize="small" />}
                    label={`GPS: ${values.latitude}, ${values.longitude}`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
              </Stack>
            </Stack>
          </Paper>
        )}

        {/* Action Buttons */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
          {onCancel && (
            <Button disabled={isSubmitting} fullWidth onClick={onCancel} size="large" variant="outlined">
              {cancelLabel}
            </Button>
          )}
          <Button
            disabled={isSubmitting || (!isDirty && Boolean(initialValues.category))}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            {isSubmitting ? 'Saving changes...' : submitLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default ComplaintForm;

