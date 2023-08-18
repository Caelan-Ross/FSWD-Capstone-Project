import { Typography, Box, IconButton, TextField, Button } from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useRouter } from 'next/router';

export default function Setting() {
	const router = useRouter();
	const handleNavigation = (path) => {
		router.push(path);
	};

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
				</Box>
			</Box>
			<Box
				mt={8}
				sx={{
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				{/* Column 1: Edit Profile */}
				<Box sx={{ flex: 1, marginRight: '20px', backgroundColor: '#fbfbfbf9', padding: '2rem', borderRadius: '10px'  }}>
					<Typography variant='h4' align='center' component='h3'>
						Edit Profile
					</Typography>
					<TextField label='Name' fullWidth variant='outlined' sx={{ mt: 2, backgroundColor: 'white' }} />
					<TextField
						label='Email'
						fullWidth
						variant='outlined'
						sx={{ mt: 2, backgroundColor: 'white' }}
					/>
				</Box>

				{/* Column 2: Change Password */}
				<Box sx={{ flex: 1, backgroundColor: '#fbfbfbf9', padding: '2rem', borderRadius: '10px' }}>
					<Typography variant='h4' align='center' component='h3'>
						Change Password
					</Typography>
					<TextField
						label='Current Password'
						fullWidth
						variant='outlined'
						type='password'
						sx={{ mt: 2, backgroundColor: 'white' }}
					/>
					<TextField
						label='New Password'
						fullWidth
						variant='outlined'
						type='password'
						sx={{ mt: 2, backgroundColor: 'white' }}
					/>
					<TextField
						label='Confirm Password'
						fullWidth
						variant='outlined'
						type='password'
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
