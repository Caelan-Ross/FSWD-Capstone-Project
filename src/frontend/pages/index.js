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
				<Box sx={{ display: 'flex', flexDirection: 'column', width: '50%', justifyContent: 'center', alignItems: 'center', margin: '6rem auto', backgroundColor: 'lavenderblush', padding: '4rem', borderRadius: '8px', outline: '1px solid black' }}><Box><Typography variant='h4' className='header-text' sx={{ margin: '2rem auto', fontSize: '4rem' }}>
					The Battery Doctor - Edmonton's Battery Reconditioners</Typography></Box>
					<Box>
						<Typography variant='h4' className='body-text' sx={{ margin: '1rem auto', fontSize: '2.2rem' }}>
							Is your car battery dead? Are you on a budget? Don't want to pay top dollar for a brand new battery?</Typography></Box>
					<Box>
						<Typography variant='h4' className='body-text' sx={{ margin: '1rem auto', fontSize: '2.2rem' }}>You've come to the right place—The Battery Doctor sells a full line of new and reconditioned batteries at Edmonton's lowest prices.
						</Typography>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}
