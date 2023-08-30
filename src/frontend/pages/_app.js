import '@/styles/globals.css';
import { CssBaseline, Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const handleNavigation = (path) => {
    router.push(path);
  };

  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const user = 'Nathan Reiman';

  return (
    <CssBaseline>
      <Box
        sx={{
          color: 'black',
          backgroundColor: '#fbfbfbf9',
          display: 'flex',
          flexDirection: 'row',
          height: '100vh',
          width: '100vw',
        }}
      >
        <Navbar
          open={open}
          handleToggle={handleToggle}
          handleNavigation={handleNavigation}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '0px 20px',
            width: '100vw',
            margin: '0 auto 0 0',
          }}
        >
          <Box
            sx={{
              backgroundColor: '#fbfbfbf9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '6rem',
              width: '95vw',
              margin: '0 auto 0 0',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexGrow: 1,
              }}
            >
              <Box sx={{ marginLeft: '0.625rem' }}>
                <Typography variant='body1' className='body-text'>
                  The Battery Doctor - Welcome {user}!
                </Typography>
                <Typography variant='caption' color='textSecondary' className='body-text'>
                  2023-08-04
                </Typography>
              </Box>
            </Box>
            <Box>
              <Button
                onClick={() => handleNavigation('/invoices/create')}
                startIcon={<AddIcon />}
                className='btn-primary'
                sx={{
                  color: '#ffffff',
                  padding: '15px',
                  borderRadius: '8px',
                }}
              >
                New Invoice
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              borderRadius: '8px',
              flex: '1',
              overflow: 'auto',
              margin: '.25rem auto 0 0',
              maxHeight: 'calc(100vh - 8.25rem)',
              width: '95vw',
              backgroundColor: '#E6E8E7',
            }}
          >
            <Component {...pageProps} />
          </Box>
        </Box>
      </Box>
    </CssBaseline>
  );
}