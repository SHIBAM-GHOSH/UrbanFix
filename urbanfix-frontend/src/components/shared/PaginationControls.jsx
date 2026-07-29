import { Pagination, Stack } from '@mui/material';

function PaginationControls({ currentPage, onChange, totalPages }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <Stack alignItems="center">
      <Pagination
        color="primary"
        count={totalPages}
        page={currentPage + 1}
        onChange={(_, selectedPage) => onChange(selectedPage - 1)}
      />
    </Stack>
  );
}

export default PaginationControls;
