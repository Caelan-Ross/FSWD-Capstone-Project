import '@/styles/globals.css';
import { CssBaseline, Box, Button, Typography, Avatar } from '@mui/material';
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

  const user = 'John Doe';

  return (
    <CssBaseline>
      <Box
        sx={{
          color: 'black',
          display: 'flex',
          flexDirection: 'row',
          height: '100vh',
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
            width: '100%',
            margin: '0 auto',
          }}
        >
          <Box
            sx={{
              flex: '0 0 auto',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '6rem',
              width: '100%',
              margin: '0 auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexGrow: 1,
              }}
            >
              <Avatar src='/path/to/avatar-image.jpg' alt='User Avatar' />
              <Box sx={{ marginLeft: '0.625rem' }}>
                <Typography variant='body1'>
                  The Battery Doctor - Welcome '{user}'!
                </Typography>
                <Typography variant='caption' color='textSecondary'>
                  2023-08-04
                </Typography>
              </Box>
            </Box>
            <Box>
              <Button
                onClick={() => handleNavigation('/invoices/createInvoice')}
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
              backgroundColor: '#959595',
              outline: '1px solid #E6E8E7',
              borderRadius: '8px',
              flex: '1',
              overflow: 'auto',
              margin: '.25rem auto',
              maxHeight: 'calc(100vh - 8.25rem)',
              width: '100%',
            }}
          >
            <Component {...pageProps} />
          </Box>
        </Box>
      </Box>
    </CssBaseline>
  );
}