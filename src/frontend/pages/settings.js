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
				backgroundColor: 'white',
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
					width: '100%'
				}}
			>
				<Typography variant='h3' align='center' component='h2'>
					Settings
				</Typography>

				<Box display='flex' onClick={() => handleNavigation('/')}>
					<IconButton>
						<ArrowCircleLeftIcon
							sx={{ fontSize: '2.5rem', color: '#000000' }}
						/>
					</IconButton>
					<Typography variant='h3' align='center' component='h2'>
						Back
					</Typography>
				</Box>
			</Box>
			<Box
				mt={12}
				sx={{
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				{/* Column 1: Edit Profile */}
				<Box sx={{ flex: 1, marginRight: '20px' }}>
					<Typography variant='h4' align='center' component='h3'>
						Edit Profile
					</Typography>
					<TextField label='Name' fullWidth variant='outlined' sx={{ mt: 2 }} />
					<TextField
						label='Email'
						fullWidth
						variant='outlined'
						sx={{ mt: 2 }}
					/>
				</Box>

				{/* Column 2: Change Password */}
				<Box sx={{ flex: 1 }}>
					<Typography variant='h4' align='center' component='h3'>
						Change Password
					</Typography>
					<TextField
						label='Current Password'
						fullWidth
						variant='outlined'
						type='password'
						sx={{ mt: 2 }}
					/>
					<TextField
						label='New Password'
						fullWidth
						variant='outlined'
						type='password'
						sx={{ mt: 2 }}
					/>
					<TextField
						label='Confirm Password'
						fullWidth
						variant='outlined'
						type='password'
						sx={{ mt: 2 }}
					/>
					<Button variant='contained' color='primary' sx={{ mt: 3 }}>
						Submit
					</Button>
				</Box>
			</Box>
		</Box>
	);
}
