import { Box, Typography } from '@mui/material';

type SectionPlaceholderProps = {
  title: string;
  description: string;
};

const SectionPlaceholder = ({ title, description }: SectionPlaceholderProps) => (
  <Box
    sx={{
      p: 4,
      borderRadius: 4,
      backgroundColor: 'var(--card-bg)',
      border: `1px solid var(--muted-color)`,
      boxShadow: `0 20px 45px -30px var(--shadow-color)`,
    }}
  >
    <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 640 }}>
      {description}
    </Typography>
  </Box>
);

export default SectionPlaceholder;

