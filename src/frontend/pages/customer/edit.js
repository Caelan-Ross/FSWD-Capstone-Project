import React, { useState, useEffect } from 'react';
import {
	Typography,
	Box,
	IconButton,
	TextField,
	Button,
	Alert,
} from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

export default function EditCustomer() {
	const router = useRouter();
	const customerId = router.query.id; // Get the customerId from the URL query parameter
	const API_BASE = 'http://localhost:7166/api/customers'; // Update the API endpoint

	const [customerDetails, setCustomerDetails] = useState({
		id: '',
		firstName: '',
		lastName: '',
		phoneNumber: 0,
		email: '',
	});

	const [isError, setIsError] = useState(null);
	const [isSuccess, setIsSuccess] = useState(false);

	useEffect(() => {
		// Fetch customer details by customerId
		axios
			.get(`${API_BASE}/${customerId}`, {
				headers: {
					accept: 'text/plain',
				},
			})
			.then((response) => {
				console.log(response);
				setCustomerDetails(response.data);
			})
			.catch((error) => {
				console.error('Error fetching customer details:', error);
			});
	}, [customerId]);

	const handleFieldChange = (field, value) => {
		setCustomerDetails((prevDetails) => ({
			...prevDetails,
			[field]: value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const updatedCustomer = {
			...customerDetails,
		};

		try {
			// Send updated customer details to API
			await axios.put(`${API_BASE}/${customerId}`, updatedCustomer);
			setIsSuccess(true);
			setTimeout(() => {
				setIsSuccess(false); // Hide success after delay
				router.push('/customer'); // Navigate back to the customer list page
			}, 1000);
		} catch (error) {
			console.error('Error updating customer details:', error);
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
				<Typography variant='h3' align='center' component='h2' className='header-text'>
					Edit Customer
				</Typography>
				<Box display='flex' onClick={() => router.push('/customer')}>
					<IconButton>
						<ArrowCircleLeftIcon
							sx={{ fontSize: '2.5rem', color: '#000000' }}
						/>
					</IconButton>
				</Box>
			</Box>

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
					value={customerDetails.firstName}
					onChange={(e) => handleFieldChange('firstName', e.target.value)}
					sx={{ mt: 2, backgroundColor: 'white' }}
				/>
				<TextField
					id='lastName'
					name='lastName'
					label='Last Name'
					type='text'
					variant='outlined'
					fullWidth
					value={customerDetails.lastName}
					onChange={(e) => handleFieldChange('lastName', e.target.value)}
					sx={{ mt: 2, backgroundColor: 'white' }}
				/>
				<TextField
					id='phoneNumber'
					name='phoneNumber'
					label='Phone Number'
					fullWidth
					variant='outlined'
					value={customerDetails.phoneNumber}
					onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
					sx={{ mt: 2, backgroundColor: 'white' }}
				/>
				<TextField
					id='email'
					name='email'
					label='Email'
					fullWidth
					variant='outlined'
					type='email'
					value={customerDetails.email}
					onChange={(e) => handleFieldChange('email', e.target.value)}
					sx={{ mt: 2, backgroundColor: 'white' }}
				/>
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
				{/* Error Message */}
				{isError && (
					<Alert severity='error' sx={{ mt: 2 }}>
						Error updating invoice details. Please try again later.
					</Alert>
				)}
			</Box>
		</Box>
	);
}
