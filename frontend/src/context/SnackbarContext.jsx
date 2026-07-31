import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import AppSnackbar from '../components/shared/AppSnackbar';

const SnackbarContext = createContext({
  showError: () => {},
  showInfo: () => {},
  showSnackbar: () => {},
  showSuccess: () => {},
  showWarning: () => {},
});

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({
    message: '',
    open: false,
    severity: 'success',
  });

  const hideSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const showSnackbar = useCallback((message, severity = 'success') => {
    if (!message) return;
    setSnackbar({
      message,
      open: true,
      severity,
    });
  }, []);

  const showSuccess = useCallback((message) => {
    showSnackbar(message, 'success');
  }, [showSnackbar]);

  const showError = useCallback((message) => {
    showSnackbar(message, 'error');
  }, [showSnackbar]);

  const showWarning = useCallback((message) => {
    showSnackbar(message, 'warning');
  }, [showSnackbar]);

  const showInfo = useCallback((message) => {
    showSnackbar(message, 'info');
  }, [showSnackbar]);

  const contextValue = useMemo(
    () => ({
      showError,
      showInfo,
      showSnackbar,
      showSuccess,
      showWarning,
    }),
    [showError, showInfo, showSnackbar, showSuccess, showWarning],
  );

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <AppSnackbar
        message={snackbar.message}
        onClose={hideSnackbar}
        open={snackbar.open}
        severity={snackbar.severity}
      />
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}

export default SnackbarContext;
