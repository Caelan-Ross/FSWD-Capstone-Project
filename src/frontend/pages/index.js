import { Typography, Box, useTheme } from '@mui/material';
import BatterySaverIcon from '@mui/icons-material/BatterySaver';
import React, { useState, useEffect } from 'react';


function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      sx={{
        backgroundColor: '#E6E8E7',
        borderRadius: '8px',
        margin: '.5rem auto',
        padding: '.5rem 1rem',
        height: '80vh',
        overflow: 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography
          className='header-text'
          variant='h3'
          align='center'
          component='h2'
          sx={{ marginRight: '1rem' }}
        >
          The Battery Doctor
        </Typography>
        <BatterySaverIcon
          sx={{
            fontSize: '4rem',
            color: 'red',
            transform: 'rotate(90deg)',
            marginLeft: '.5rem',
            backgroundColor: 'lavenderblush',
            borderRadius: '50%',
            padding: '.5rem',
            outline: '1px solid #939393f9',
          }}
        />
      </Box>
      <Box
        textAlign='left'
        mt={2}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant='h4'
          className='header-text'
          sx={{ margin: '2rem auto', fontSize: '3rem' }}
        >
          The Battery Doctor - Edmonton's Battery Reconditioners
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'lavenderblush',
            padding: '2rem',
            borderRadius: '8px',
            outline: '1px solid black',
            width: '100%',
          }}
        >
          {/* Clock Component */}
          <Typography variant="h4" gutterBottom>
            {formattedTime}
          </Typography>

          
        </Box>
      </Box>
    </Box>
  );
}

export default Home;