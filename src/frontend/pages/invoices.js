import { Typography, Box, useTheme } from '@mui/material';
import Link from '@mui/material/Link';

export default function Home() {
	return (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			sx={{
				backgroundColor: 'white',
				margin: '30px',
				padding: '30px',
				minHeight: '100vh',
				py: 4,
			}}
		>
			<Typography variant='h1' align='center' component='h2'>
				Invoices
			</Typography>
			<Box textAlign='left' mt={2}>
				<Typography variant='body1' component='p'>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reiciendis neque consequuntur in tempora, placeat ullam nihil praesentium reprehenderit quaerat, numquam quibusdam repellendus quidem tempore temporibus quas est? Nesciunt, recusandae et.
				</Typography>
			</Box>
		</Box>
	);
}
