import { Typography, Box, useTheme } from '@mui/material';
import Icon from '@mui/material';
import BatterySaverIcon from '@mui/icons-material/BatterySaver';
import Link from '@mui/material/Link';

export default function Home() {
	const theme = useTheme();

	return (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			sx={{
				backgroundColor: '#E6E8E7',
				outline: '1px solid lightgrey',
				borderRadius: '8px',
				margin: '2rem',
				padding: '2rem',
				height: '92%',
				overflow: 'auto',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					width: '100%',
				}}
			>
				<Typography variant='h3' align='center' component='h2'>
					The Battery Doctor 
				</Typography>
				<BatterySaverIcon sx={{fontSize: '4rem', color: 'red', transform: 'rotate(90deg)', marginLeft: '.5rem', backgroundColor: 'lavenderblush', borderRadius: '50%', padding: '.5rem', outline: '1px solid black'}}></BatterySaverIcon>
			</Box>
			<Box textAlign='left' mt={2} sx={{height: '90%', width: '95%', backgroundColor: '#fbfbfbf9',
					borderRadius: '10px'}}>
				<Typography variant='body1' component='p'>
					PLACEHOLDER CONTENT FOR TWO DASHBOARDS
				</Typography>
			</Box>
		</Box>
	);
}
