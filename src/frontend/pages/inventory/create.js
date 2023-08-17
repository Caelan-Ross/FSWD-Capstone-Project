import {
	Typography,
	Box,
	IconButton,
	TextField,
	Button,
	Alert,
	MenuItem,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import axios from 'axios';

export default function Home() {
	const router = useRouter();
	const handleNavigation = (path) => {
		router.push(path);
	};

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const API_BASE = 'http://localhost:3000/api/Batteries';

	// Dummy Data for the lists
	const [typeOptions, setTypeOptions] = useState([
		{ id: 1, name: 'Type A' },
		{ id: 2, name: 'Type B' },
	]);

	const [modelOptions, setModelOptions] = useState([
		{ id: 1, name: 'Model X' },
		{ id: 2, name: 'Model Y' },
	]);

	const [makeOptions, setMakeOptions] = useState([
		{ id: 1, name: 'Make 1' },
		{ id: 2, name: 'Make 2' },
	]);

	const [groupOptions, setGroupOptions] = useState([
		{ id: 1, name: 'Group Alpha' },
		{ id: 2, name: 'Group Beta' },
	]);

	// Submit Button
	const handleSubmit = async (event) => {
		event.preventDefault();
		// const form = event.target;

		// const queryParams = new URLSearchParams();
		// queryParams.append('firstName', form.firstName.value);
		// queryParams.append('lastName', form.lastName.value);
		// queryParams.append('phoneNumber', form.phoneNumber.value);
		// queryParams.append('email', form.email.value);
		// const url = `${API_BASE}?${queryParams.toString()}`;
		// try {
		// 	setLoading(true);
		// 	// Perform any additional validation or processing here if needed
		// 	setError(null);

		// 	await axios.post(url);
		// 	// Display success message
		// 	alert('Customer created successfully');
		// 	// Reset form fields
		// 	form.reset();
		// } catch (error) {
		// 	setError('Failed to create customer');
		// } finally {
		// 	setLoading(false);
		// }
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
				height: '94%',
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
				{error && <Alert severity='error'>{error}</Alert>}
				<Typography variant='h3' align='center' component='h2'>
					Create Battery
				</Typography>

				<Box display='flex' onClick={() => handleNavigation('/inventory')}>
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
				mt={12}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '30%',
					backgroundColor: '#ffffff80',
					borderRadius: '8px',
					outline: '1px solid black',
					padding: '2rem',
				}}
			>
				{/* <TextField
					id='typeName'
					name='typeName'
					label='Type'
					type='text'
					variant='outlined'
					fullWidth
					sx={{ mt: 2, backgroundColor: 'white' }}
				/> */}
				{/* Dropdown for Battery Type */}
				<TextField
					select
					id='type'
					name='type'
					label='Type'
					variant='outlined'
					fullWidth
					sx={{ mt: 2, backgroundColor: 'white' }}
				>
					{typeOptions.map((option) => (
						<MenuItem key={option.id} value={option.id}>
							{option.name}
						</MenuItem>
					))}
				</TextField>
				{/* Dropdown for Battery Model */}
				<TextField
					select
					id='modelName'
					name='modelName'
					label='Model'
					variant='outlined'
					fullWidth
					sx={{ mt: 2, backgroundColor: 'white' }}
				>
					{modelOptions.map((option) => (
						<MenuItem key={option.id} value={option.id}>
							{option.name}
						</MenuItem>
					))}
				</TextField>
				{/* Dropdown for Battery Make */}
				<TextField
					select
					id='makeName'
					name='makeName'
					label='Make'
					variant='outlined'
					fullWidth
					sx={{ mt: 2, backgroundColor: 'white' }}
				>
					{makeOptions.map((option) => (
						<MenuItem key={option.id} value={option.id}>
							{option.name}
						</MenuItem>
					))}
				</TextField>
				<TextField
					id='voltage'
					name='voltage'
					label='Voltage'
					type='text'
					variant='outlined'
					fullWidth
					sx={{ mt: 2, backgroundColor: 'white' }}
				/>
				<TextField
					id='capacity'
					name='capacity'
					label='Capacity'
					type='text'
					variant='outlined'
					fullWidth
					sx={{ mt: 2, backgroundColor: 'white' }}
				/>
				<TextField
					id='price'
					name='price'
					label='Price'
					fullWidth
					variant='outlined'
					type=''
					sx={{ mt: 2, backgroundColor: 'white' }}
				/>
				<TextField
					id='qtyOnHand'
					name='qtyOnHand'
					label='Qty On Hand'
					fullWidth
					variant='outlined'
					type='email'
					sx={{ mt: 2, backgroundColor: 'white' }}
				/>
				{/* Dropdown for Battery Group */}
				<TextField
					select
					id='groupName'
					name='groupName'
					label='Group'
					variant='outlined'
					fullWidth
					sx={{ mt: 2, backgroundColor: 'white' }}
				>
					{groupOptions.map((option) => (
						<MenuItem key={option.id} value={option.id}>
							{option.name}
						</MenuItem>
					))}
				</TextField>
				{/* Create Button */}
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
		</Box>
	);
}
