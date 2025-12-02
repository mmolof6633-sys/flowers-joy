'use client';

import { Container, Typography } from '@mui/material';

export function BouquetPage({ bouquetId }: { bouquetId: string }) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Букет {bouquetId}
      </Typography>
      {/* Bouquet details */}
    </Container>
  );
}
