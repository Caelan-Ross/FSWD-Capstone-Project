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
				<BatterySaverIcon sx={{fontSize: '3rem', color: 'red', transform: 'rotate(45deg)', marginLeft: '.5rem'}}></BatterySaverIcon>
			</Box>
			<Box textAlign='left' mt={2}>
				<Typography variant='body1' component='p'>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reiciendis
					neque consequuntur in tempora, placeat ullam nihil praesentium
					reprehenderit quaerat, numquam quibusdam repellendus quidem tempore
					temporibus quas est? Nesciunt, recusandae et.
				</Typography>
			</Box>
		</Box>
	);
}
