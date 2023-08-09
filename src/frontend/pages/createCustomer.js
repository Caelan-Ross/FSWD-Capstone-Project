import { Typography, Box, IconButton, TextField, Button } from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useRouter } from 'next/router';

export default function Home() {
	const router = useRouter();
	const handleNavigation = (path) => {
		router.push(path);
	};

	return (
		<Box
			display='block'
			flexDirection='column'
			alignItems='center'
			sx={{
				backgroundColor: '#E6E8E7',
				outline: '1px solid lightgrey',
				borderRadius: '8px',
				margin: '30px',
				padding: '30px',
				height: '90%',
				py: 4,
			}}
		>
			{/* Page Heading & Back Button */}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					width: '100%',
				}}
			>
				<Typography variant='h3' align='center' component='h2'>
					Create Customer
				</Typography>

				<Box display='flex' onClick={() => handleNavigation('/')}>
					<IconButton>
						<ArrowCircleLeftIcon
							sx={{ fontSize: '2.5rem', color: '#000000' }}
						/>
					</IconButton>
				</Box>
			</Box>
			<Box
				mt={12}
				sx={{
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				<Box sx={{ flex: 1, marginRight: '20px' }}>
					<TextField
						label='First Name'
						fullWidth
						variant='outlined'
						sx={{ mt: 2, backgroundColor: 'white' }}
					/>
					<TextField
						label='Last Name'
						fullWidth
						variant='outlined'
						sx={{ mt: 2, backgroundColor: 'white' }}
					/>
				</Box>
				<Box sx={{ flex: 1 }}>
					<TextField
						label='Phone No.'
						fullWidth
						variant='outlined'
						type=''
						sx={{ mt: 2, backgroundColor: 'white' }}
					/>
					<TextField
						label='Email'
						fullWidth
						variant='outlined'
						type='email'
						sx={{ mt: 2, backgroundColor: 'white' }}
					/>
					<Button variant='contained' color='primary' sx={{ mt: 3 }}>
						Submit
					</Button>
				</Box>
			</Box>
		</Box>
	);
}
