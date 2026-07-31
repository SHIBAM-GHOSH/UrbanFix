import SectionCard from './SectionCard';

function FilterPanel({ children, onSubmit }) {
  return (
    <SectionCard component="form" onSubmit={onSubmit} sx={{ p: 2 }}>
      {children}
    </SectionCard>
  );
}

export default FilterPanel;
