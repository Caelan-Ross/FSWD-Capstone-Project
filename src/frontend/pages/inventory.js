import { Typography, Box, IconButton } from '@mui/material';

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
				minHeight: '100%',
				py: 4,
			}}
		>
			{/* Page Heading & Back Button */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					width: '100%'
				}}
			>
				<Typography variant='h3' align='center' component='h2'>
					Inventory
				</Typography>
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
