import { Typography, Box, useTheme } from '@mui/material';
import BatterySaverIcon from '@mui/icons-material/BatterySaver';

export default function Home() {
	const theme = useTheme();

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
				<BatterySaverIcon sx={{ fontSize: '4rem', color: 'red', transform: 'rotate(90deg)', marginLeft: '.5rem', backgroundColor: 'lavenderblush', borderRadius: '50%', padding: '.5rem', outline: '1px solid #939393f9' }}></BatterySaverIcon>
			</Box>
			<Box textAlign='left' mt={2} sx={{
									height: '90%',
									padding: '.5rem',
									marginTop: theme.spacing(2),
									backgroundColor: '#fbfbfbf9',
									borderRadius: '10px',
									width: '90%',
									margin: 'auto',
									alignItems: 'center',
									justifyContent: 'center'
			}}>
				<Typography variant='body1' component='p' className='body-text'>
					The Battery Doctor - Welcome Nathan Reiman!
				</Typography>
			</Box>
		</Box>
	);
}
