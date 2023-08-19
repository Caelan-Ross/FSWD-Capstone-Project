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
import { Snackbar, SnackbarContent } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import axios from 'axios';

export default function Home() {
	const router = useRouter();
	const batteryId = router.query.id; // Get the customerId from the URL query parameter
	const API_BASE = 'http://localhost:7166/api/Batteries'; // Update the API endpoint

	const [error, setError] = useState(null);
	const [batteryDetails, setBatteryDetails] = useState({
		typeName: '',
		modelName: '',
		makeName: '',
		voltage: '',
		capacity: '',
		price: '',
		quantityOnHand: '',
		groupName: '',
	});

	const [isSuccess, setIsSuccess] = useState(false); // State for showing success message

	useEffect(() => {
		// Fetch battery details by batteryId
		axios
			.get(`${API_BASE}/${batteryId}`, {
				headers: {
					accept: 'text/plain',
				},
			})
			.then((response) => {
				console.log(response);
				// Update batteryDetails state with fetched data
				setBatteryDetails(response.data);
			})
			.catch((error) => {
				console.error('Error fetching battery details:', error);
			});
	}, [batteryId]);

	const handleFieldChange = (field, value) => {
		setBatteryDetails((prevDetails) => ({
			...prevDetails,
			[field]: value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const updatedBattery = {
			...batteryDetails,
		};
		try {
			// Send updated battery details to API
			await axios.put(`${API_BASE}/${batteryId}`, updatedBattery);
			setIsSuccess(true);
			setTimeout(() => {
				setIsSuccess(false); // Hide success after delay
				router.push('/inventory'); // Navigate back to the inventory list page
			}, 1500);
		} catch (error) {
			console.error('Error updating battery details:', error);
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
					width: '100%',
				}}
			>
				{error && <Alert severity='error'>{error}</Alert>}
				<Typography variant='h3' align='center' component='h2'>
					Edit Battery
				</Typography>

				<Box display='flex' onClick={() => router.push('/inventory')}>
					<IconButton>
						<ArrowCircleLeftIcon
							sx={{ fontSize: '2.5rem', color: '#000000' }}
						/>
					</IconButton>
				</Box>
			</Box>

			{/* Edit Form */}
			<Box
				component='form'
				// onSubmit={handleSubmit}
				mt={8}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '80%',
					backgroundColor: '#fbfbfbf9',
					borderRadius: '8px',
					outline: '1px solid black',
					padding: '2rem',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						padding: '2rem',
						width: '100%',
						justifyContent: 'space-between',
						margin: '0 auto',
						borderRight: '1px solid lightgray',
						borderLeft: '1px solid lightgray',
						borderBottom: '1px solid #ecececf9',
						borderTop: '1px solid #ecececf9',
						padding: '10px',
						borderRadius: '10px',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							width: '48%',
						}}
					>
						{/* Dropdown for Battery Type */}
						<TextField
							// select
							id='typeName'
							name='typeName'
							label='Type'
							variant='outlined'
							fullWidth
							value={batteryDetails.typeName}
							sx={{ mt: 2, backgroundColor: 'white' }}
						>
							{/* {typeOptions.map((option) => (
								<MenuItem key={option.id} value={option.id}>
									{option.typeName}
								</MenuItem>
							))} */}
						</TextField>
						{/* Dropdown for Battery Model */}
						<TextField
							// select
							id='modelName'
							name='modelName'
							label='Model'
							variant='outlined'
							fullWidth
							value={batteryDetails.modelName}
							sx={{ mt: 2, backgroundColor: 'white' }}
						>
							{/* {modelOptions.map((option) => (
								<MenuItem key={option.id} value={option.id}>
									{option.modelName}
								</MenuItem>
							))} */}
						</TextField>
						{/* Dropdown for Battery Make */}
						<TextField
							// select
							id='makeName'
							name='makeName'
							label='Make'
							variant='outlined'
							fullWidth
							value={batteryDetails.makeName}
							sx={{ mt: 2, backgroundColor: 'white' }}
						>
							{/* {makeOptions.map((option) => (
								<MenuItem key={option.id} value={option.id}>
									{option.name}
								</MenuItem>
							))} */}
						</TextField>
						<TextField
							id='voltage'
							name='voltage'
							label='Voltage'
							type='text'
							variant='outlined'
							fullWidth
							value={batteryDetails.voltage}
							onChange={(e) => handleFieldChange('voltage', e.target.value)}
							sx={{ mt: 2, backgroundColor: 'white' }}
						/>
					</Box>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							width: '48%',
						}}
					>
						<TextField
							id='capacity'
							name='capacity'
							label='Capacity'
							type='text'
							variant='outlined'
							fullWidth
							value={batteryDetails.capacity}
							sx={{ mt: 2, backgroundColor: 'white' }}
						/>
						<TextField
							id='price'
							name='price'
							label='Price'
							type='text'
							variant='outlined'
							fullWidth
							value={batteryDetails.price}
							sx={{ mt: 2, backgroundColor: 'white' }}
						/>
						<TextField
							id='qtyOnHand'
							name='qtyOnHand'
							label='Qty On Hand'
							type='text'
							variant='outlined'
							fullWidth
							value={batteryDetails.quantityOnHand}
							sx={{ mt: 2, backgroundColor: 'white' }}
						/>
						{/* Dropdown for Battery Group */}
						<TextField
							// select
							id='groupName'
							name='groupName'
							label='Group'
							type='text'
							variant='outlined'
							fullWidth
							value={batteryDetails.groupName}
							sx={{ mt: 2, backgroundColor: 'white' }}
						>
							{/* {groupOptions.map((option) => (
								<MenuItem key={option.id} value={option.id}>
									{option.groupName}
								</MenuItem>
							))} */}
						</TextField>
					</Box>
				</Box>
				{/* Edit Button */}
				<Button
					className='btn-primary'
					variant='contained'
					type='submit'
					color='primary'
					sx={{ mt: 3, width: '50%', textAlign: 'center', margin: '1rem auto' }}
				>
					Save
				</Button>
				{/* Success Message */}
				{isSuccess && (
					<Alert severity='success' sx={{ mt: 2 }}>
						Edit successful!
					</Alert>
				)}
			</Box>
		</Box>
	);
}
