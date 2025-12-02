import { Container, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Страница не найдена
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Запрашиваемая страница не существует.
      </Typography>
      <Box mt={4}>
        <Button component={Link} href="/" variant="contained" color="primary">
          На главную
        </Button>
      </Box>
    </Container>
  );
}

