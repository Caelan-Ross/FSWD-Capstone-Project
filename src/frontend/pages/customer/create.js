import {
	Typography,
	Box,
	IconButton,
	TextField,
	Button,
	Alert,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { Snackbar, SnackbarContent } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import axios from 'axios';

export default function Home() {
	const router = useRouter();
	const handleNavigation = (path) => {
		router.push(path);
	};

	const [isError, setIsError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showSnackbar, setShowSnackbar] = useState(false);
	const API_BASE = 'http://localhost:3000/api/customer/create';

	// Submit Button
	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.target;

		const queryParams = new URLSearchParams();
		queryParams.append('firstName', form.firstName.value);
		queryParams.append('lastName', form.lastName.value);
		queryParams.append('phoneNumber', form.phoneNumber.value);
		queryParams.append('email', form.email.value);
		const url = `${API_BASE}?${queryParams.toString()}`;
		try {
			setLoading(true);
			// Perform any additional validation or processing here if needed
			setIsError(null);

			await axios.post(url);
			setShowSnackbar(true);
			setTimeout(() => {
				setShowSnackbar(false);
				router.push('/customer');
			}, 2000);
			// Reset form fields
			form.reset();
		} catch (error) {
			setIsError('Failed to create customer');
		} finally {
			setLoading(false);
		}
	};

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
				overflow: 'auto',
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
				{isError && <Alert severity='error'>{isError}</Alert>}
				<Typography variant='h3' align='center' component='h2' className='header-text'>
					Create Customer
				</Typography>
				<Box display='flex' onClick={() => handleNavigation('/customer')}>
					<IconButton>
						<ArrowCircleLeftIcon
							sx={{ fontSize: '2.5rem', color: '#000000' }}
						/>
					</IconButton>
				</Box>
			</Box>
			{/* Entry form */}
			<Box
				component='form'
				onSubmit={handleSubmit}
				mt={8}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '30%',
					backgroundColor: '#fbfbfbf9',
					borderRadius: '8px',
					outline: '1px solid black',
					padding: '2rem',
				}}
			>
				<TextField
					id='firstName'
					name='firstName'
					label='First Name'
					type='text'
					variant='outlined'
					fullWidth
					sx={{ mt: 2, backgroundColor: 'white' }}
				/>
				<TextField
					id='lastName'
					name='lastName'
					label='Last Name'
					type='text'
					variant='outlined'
					fullWidth
					sx={{ mt: 2, backgroundColor: 'white' }}
				/>
				<TextField
					id='phoneNumber'
					name='phoneNumber'
					label='Phone Number'
					fullWidth
					variant='outlined'
					type=''
					sx={{ mt: 2, backgroundColor: 'white' }}
				/>
				<TextField
					id='email'
					name='email'
					label='Email'
					fullWidth
					variant='outlined'
					type='email'
					sx={{ mt: 2, backgroundColor: 'white' }}
				/>
				<Button
					className='btn-primary'
					variant='contained'
					type='submit'
					disabled={loading}
					color='primary'
					sx={{ mt: 3, width: '50%', textAlign: 'center', margin: '1rem auto' }}
				>
					{loading ? 'Creating...' : 'Create'}
				</Button>
			</Box>
			<Snackbar
				open={showSnackbar}
				autoHideDuration={2000}
				onClose={() => setShowSnackbar(false)} // Close on click away
			>
				<SnackbarContent
					message='Customer created successfully'
					action={<CheckCircleOutline />}
				/>
			</Snackbar>
		</Box>
	);
}
