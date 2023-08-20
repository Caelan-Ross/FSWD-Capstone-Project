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
	const batteryId = router.query.id; // Get the batteryId from the URL query parameter
	const API_BASE = 'http://localhost:7166/api'; // Update the API endpoint

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

	const [error, setError] = useState(null);
	const [isSuccess, setIsSuccess] = useState(false); // State for showing success message
	const [typeOptions, setTypeOptions] = useState([]);
	const [modelOptions, setModelOptions] = useState([]);
	const [makeOptions, setMakeOptions] = useState([]);
	const [groupOptions, setGroupOptions] = useState([]);

	useEffect(() => {
		// Fetch the battery to edit
		axios
			.get(`${API_BASE}/Batteries/${batteryId}`, {
				headers: {
					accept: 'text/plain',
				},
			})
			.then((response) => {
				console.log(response);
				const batteryData = response.data;
				// Update batteryDetails state with fetched data
				setBatteryDetails(response.data);
				setBatteryDetails((prevDetails) => ({
					...prevDetails,
					typeName: batteryData.typeName,
					modelName: batteryData.modelName,
					modelName: batteryData.modelName,
					groupName: batteryData.groupName,
				}));
			})
			.catch((error) => {
				console.error('Error fetching battery details:', error);
			});

		// Fetch battery type options
		axios
			.get(`${API_BASE}/BatteryTypes`)
			.then((response) => {
				setTypeOptions(response.data);
			})
			.catch((error) => {
				console.error('Error fetching type options:', error);
			});

		// Fetch battery model options
		axios
			.get(`${API_BASE}/BatteryModels`)
			.then((response) => {
				setModelOptions(response.data);
			})
			.catch((error) => {
				console.error('Error fetching model options:', error);
			});

		// Fetch battery make options
		axios
			.get(`${API_BASE}/BatteryMakes`)
			.then((response) => {
				setMakeOptions(response.data);
			})
			.catch((error) => {
				console.error('Error fetching make options:', error);
			});

		// Fetch battery group options
		axios
			.get(`${API_BASE}/BatteryGroups`)
			.then((response) => {
				setGroupOptions(response.data);
			})
			.catch((error) => {
				console.error('Error fetching group options:', error);
			});
	}, [batteryId]);

	const handleFieldChange = (field, value) => {
		setBatteryDetails((prevDetails) => ({
			...prevDetails,
			[field]: value,
		}));
	};

	const handleBatteryTypeSelection = (selectedTypeName) => {
		setBatteryDetails((prevDetails) => ({
			...prevDetails,
			typeName: selectedTypeName,
		}));
	};

	const handleBatteryModelTypeSelection = (selectedModelName) => {
		setBatteryDetails((prevDetails) => ({
			...prevDetails,
			modelName: selectedModelName,
		}));
	};

	const handleBatteryMakeTypeSelection = (selectedMakeName) => {
		setBatteryDetails((prevDetails) => ({
			...prevDetails,
			makeName: selectedMakeName,
		}));
	};

	const handleBatteryGroupTypeSelection = (selectedGroupName) => {
		setBatteryDetails((prevDetails) => ({
			...prevDetails,
			groupName: selectedGroupName,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const updatedBattery = {
			typeName: batteryDetails.typeName,
			modelName: batteryDetails.modelName,
			makeName: batteryDetails.makeName,
			groupName: batteryDetails.groupName,
			capacity: parseFloat(batteryDetails.capacity),
			voltage: parseFloat(batteryDetails.voltage),
			quantityOnHand: parseFloat(batteryDetails.quantityOnHand),
			price: parseFloat(batteryDetails.price),
		};

		console.log('Update battery details:', updatedBattery);
		try {
			// Send updated battery details to API
			await axios.put(`${API_BASE}/Batteries/${batteryId}`, updatedBattery);

			setIsSuccess(true);
			setTimeout(() => {
				setIsSuccess(false); // Hide success after delay
				router.push('/inventory'); // Navigate back to the inventory list page
			}, 1000);
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
				margin: '1rem',
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
				onSubmit={handleSubmit}
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
							select
							id='typeName'
							name='typeName'
							label='Type'
							variant='outlined'
							fullWidth
							value={batteryDetails.typeName}
							onChange={(e) => handleBatteryTypeSelection(e.target.value)}
							sx={{ mt: 2, backgroundColor: 'white' }}
						>
							{typeOptions.map((option) => (
								<MenuItem key={option.id} value={option.typeName}>
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
							value={batteryDetails.modelName}
							onChange={(e) => handleBatteryModelTypeSelection(e.target.value)}
							sx={{ mt: 2, backgroundColor: 'white' }}
						>
							{modelOptions.map((option) => (
								<MenuItem key={option.id} value={option.modelName}>
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
							value={batteryDetails.makeName}
							onChange={(e) => handleBatteryMakeTypeSelection(e.target.value)}
							sx={{ mt: 2, backgroundColor: 'white' }}
						>
							{makeOptions.map((option) => (
								<MenuItem key={option.id} value={option.name}>
									{option.name}
								</MenuItem>
							))}
						</TextField>
						{/* Dropdown for Battery Group */}
						<TextField
							select
							id='groupName'
							name='groupName'
							label='Group'
							type='text'
							variant='outlined'
							fullWidth
							value={batteryDetails.groupName}
							onChange={(e) => handleBatteryGroupTypeSelection(e.target.value)}
							sx={{ mt: 2, backgroundColor: 'white' }}
						>
							{groupOptions.map((option) => (
								<MenuItem key={option.id} value={option.groupName}>
									{option.groupName}
								</MenuItem>
							))}
						</TextField>
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
							onChange={(e) => handleFieldChange('capacity', e.target.value)}
							sx={{ mt: 2, backgroundColor: 'white' }}
						/>
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
						<TextField
							id='price'
							name='price'
							label='Price'
							type='text'
							variant='outlined'
							fullWidth
							value={batteryDetails.price}
							onChange={(e) => handleFieldChange('price', e.target.value)}
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
							onChange={(e) =>
								handleFieldChange('quantityOnHand', e.target.value)
							}
							sx={{ mt: 2, backgroundColor: 'white' }}
						/>
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
