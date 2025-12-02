'use client';

import { AppBar, Toolbar, Typography, Box } from '@mui/material';

export function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Flowers Joy
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>{/* Navigation items */}</Box>
      </Toolbar>
    </AppBar>
  );
}
