import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

function ConfirmDialog({
  cancelLabel = 'Cancel',
  confirmColor = 'primary',
  confirmLabel = 'Confirm',
  description,
  isConfirming = false,
  onClose,
  onConfirm,
  open,
  title,
}) {
  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      {description && (
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose}>{cancelLabel}</Button>
        <Button color={confirmColor} disabled={isConfirming} onClick={onConfirm} variant="contained">
          {isConfirming ? 'Working...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
