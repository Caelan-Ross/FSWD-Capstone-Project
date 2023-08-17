import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
	Typography,
	Box,
	IconButton,
	TextField,
	Button,
	Alert,
	MenuItem,
} from '@mui/material';
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

	// Drop down for Battery Type Dropdown
	const [typeOptions, setTypeOptions] = useState([]);
	const [modelOptions, setModelOptions] = useState([]);
	const [makeOptions, setMakeOptions] = useState([]);
	const [groupOptions, setGroupOptions] = useState([]);

	useEffect(() => {
		// Fetch data for battery type dropdown
		axios
			.get('http://localhost:7166/api/BatteryTypes')
			.then((response) => {
				setTypeOptions(response.data);
			})
			.catch((error) => {
				console.error('Error fetching type options:', error);
			});

		// Fetch data for battery model dropdown
		axios
			.get('http://localhost:7166/api/BatteryModels')
			.then((response) => {
				setModelOptions(response.data);
			})
			.catch((error) => {
				console.error('Error fetching type options:', error);
			});

		// Fetch data for battery make dropdown
		axios
			.get('http://localhost:7166/api/BatteryMakes')
			.then((response) => {
				setMakeOptions(response.data);
			})
			.catch((error) => {
				console.error('Error fetching type options:', error);
			});

		// Fetch data for battery group dropdown
		axios
			.get('http://localhost:7166/api/BatteryGroups')
			.then((response) => {
				setGroupOptions(response.data);
			})
			.catch((error) => {
				console.error('Error fetching type options:', error);
			});
	}, []);

	// Submit Button
	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.target;
		const url = `http://localhost:7166/api/Batteries`;
		const requestData = {
			typeId: form.typeName.value,
			modelId: form.modelName.value,
			makeId: form.makeName.value,
			voltage: form.voltage.value,
			capacity: form.capacity.value,
			price: form.price.value,
			quantityOnHand: form.qtyOnHand.value,
			groupId: form.groupName.value,
		};
		try {
			setLoading(true);
			// Perform any additional validation or processing here if needed
			setError(null);

			await axios.post(url, requestData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			// Display success message
			alert('Battery created successfully');
			// Reset form fields
			form.reset();
		} catch (error) {
			setError('Failed to create customer');
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
				{/* Dropdown for Battery Type */}
				<TextField
					select
					id='typeName'
					name='typeName'
					label='Type'
					variant='outlined'
					fullWidth
					sx={{ mt: 2, backgroundColor: 'white' }}
				>
					{typeOptions.map((option) => (
						<MenuItem key={option.id} value={option.id}>
							{option.typeName}
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
							{option.modelName}
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
					type='text'
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
							{option.groupName}
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
