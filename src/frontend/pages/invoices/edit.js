import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

export default function Home() {
	const router = useRouter();
	const invoiceId = router.query.id; // Get the invoiceId from the URL query parameter
	const API_BASE = 'http://localhost:7166/api/Invoices'; // Update the API endpoint
	const [invoiceDetails, setInvoiceDetails] = useState({
		id: '',
		customerId: '',
		paymentMethodR: '',
		totalPrice: '',
	});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [customerOptions, setCustomerOptions] = useState([]);
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [totalAmount, setTotalAmount] = useState(invoiceDetails.totalPrice);

	// Get customer details by ID
	const fetchCustomer = async (customerId) => {
		try {
			const response = await axios.get(
				`http://localhost:7166/api/Customers/${customerId}`
			);
			return response.data;
		} catch (error) {
			console.error('Error fetching customer details:', error);
			return null;
		}
	};

	const [isSuccess, setIsSuccess] = useState(false); // State for showing success message

	useEffect(() => {
		// Fetch invoice details by invoiceId
		axios
			.get(`${API_BASE}/${invoiceId}`)
			.then((response) => {
				console.log(response);
				// Update invoiceDetails state with fetched data
				setInvoiceDetails(response.data);

				// Fetch customer details by customerId
				fetchCustomer(response.data.customerId)
					.then((customerData) => {
						if (customerData) {
							setSelectedCustomer(customerData);
						}
					})
					.catch((error) => {
						console.error('Error fetching customer details:', error);
					});
			})
			.catch((error) => {
				console.error('Error fetching invoice details:', error);
			});

		// Get total customer list and store it in customerOptions state
		axios
			.get(`http://localhost:7166/api/Customers`)
			.then((response) => {
				console.log(response);
				setCustomerOptions(response.data);
			})
			.catch((error) => {
				console.error('Error fetching customer database:', error);
			});
	}, [invoiceId]);

	// Update totalAmount when invoiceDetails.totalPrice changes
	useEffect(() => {
		setTotalAmount(invoiceDetails.totalPrice);
	}, [invoiceDetails.totalPrice]);

	const handleFieldChange = (field, value) => {
		setInvoiceDetails((prevDetails) => ({
			...prevDetails,
			[field]: value,
		}));
	};

	const handleCustomerSelection = (event) => {
		const selectedCustomerId = event.target.value;
		const selectedCustomer = customerOptions.find(
			(customer) => customer.id === selectedCustomerId
		);
		setSelectedCustomer(selectedCustomer);

		// Update customer details in the invoice
		handleFieldChange('customerId', selectedCustomerId);
		setInvoiceDetails((prevDetails) => ({
			...prevDetails,
			customerId: selectedCustomerId,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const updatedInvoice = {
			...invoiceDetails,
			totalPrice: totalAmount
		};

		try {
			// Send updated invoice details to API
			await axios.put(`${API_BASE}/${invoiceId}`, updatedInvoice);
			setIsSuccess(true);
			setTimeout(() => {
				setIsSuccess(false); // Hide success after delay
				router.push('/invoices'); // Navigate back to the customer list page
			}, 1500);
		} catch (error) {
			console.error('Error updating invoice details:', error);
		}
	};

	return (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			sx={{
				backgroundColor: '#fbfbfbf9',
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
				<Typography variant='h3' align='center' component='h2'>
					Edit Invoice
				</Typography>
				<Box display='flex' onClick={() => router.push('/invoices')}>
					<IconButton>
						<ArrowCircleLeftIcon
							sx={{ fontSize: '2.5rem', color: '#000000' }}
						/>
					</IconButton>
				</Box>
			</Box>

			{/* Invoice Form */}
			<Box
				component='form'
				onSubmit={handleSubmit}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					backgroundColor: '#fbfbfbf9',
					borderRadius: '8px',
					outline: '1px solid black',
					padding: '1rem',
					justifyContent: 'space-evenly',
					alignItems: 'center',
					margin: '1rem auto',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-evenly',
						alignItems: 'flex-start',
						margin: '0 auto',
						width: '100%',
						backgroundColor: '#fbfbfbf9',
						borderRadius: '8px',
					}}
				>
					{/* Customer Section */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'left',
							margin: '0 auto',
							width: '90%',
							backgroundColor: '#fbfbfbf9',
							borderRight: '1px solid lightgray',
							borderLeft: '1px solid lightgray',
							borderBottom: '1px solid #ecececf9',
							borderTop: '1px solid #ecececf9',
							padding: '10px',
							borderRadius: '10px',
						}}
					>
						<Typography variant='h6'>Customer Details</Typography>
						{/* Customer drop down */}
						<TextField
							select
							id='customerId'
							name='customerId'
							label='Customer'
							variant='outlined'
							fullWidth
							value={selectedCustomer}
							onChange={handleCustomerSelection}
							sx={{ mt: 1, backgroundColor: 'white' }}
						>
							{customerOptions.map((option) => (
								<MenuItem key={option.id} value={option.id}>
									{`${option.firstName} ${option.lastName}`}
								</MenuItem>
							))}
						</TextField>
						<Box
							sx={{
								width: '100%',
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
							}}
						>
							<TextField
								id='firstName'
								name='firstName'
								label='First Name'
								variant='outlined'
								type='text'
								value={selectedCustomer ? selectedCustomer.firstName : ''}
								InputLabelProps={{
									shrink:
										selectedCustomer && selectedCustomer.firstName
											? true
											: false,
								}}
								sx={{ mt: 2, backgroundColor: 'white', width: '48%' }}
							/>

							<TextField
								id='lastName'
								name='lastName'
								label='Last Name'
								variant='outlined'
								type='text'
								value={selectedCustomer ? selectedCustomer.lastName : ''}
								InputLabelProps={{
									shrink:
										selectedCustomer && selectedCustomer.lastName
											? true
											: false,
								}}
								sx={{ mt: 2, backgroundColor: 'white', width: '48%' }}
							/>
						</Box>
						<Box
							sx={{
								width: '100%',
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
							}}
						>
							<TextField
								id='email'
								name='email'
								label='Email'
								fullWidth
								variant='outlined'
								type='email'
								value={selectedCustomer ? selectedCustomer.email : ''}
								InputLabelProps={{
									shrink:
										selectedCustomer && selectedCustomer.email ? true : false,
								}}
								sx={{ mt: 2, backgroundColor: 'white', width: '48%' }}
							/>
							<TextField
								id='phoneNumber'
								name='phoneNumber'
								label='Phone Number'
								fullWidth
								variant='outlined'
								type='text'
								value={selectedCustomer ? selectedCustomer.phoneNumber : ''}
								InputLabelProps={{
									shrink:
										selectedCustomer && selectedCustomer.phoneNumber
											? true
											: false,
								}}
								sx={{ mt: 2, backgroundColor: 'white', width: '48%' }}
							/>
						</Box>
						<TextField
							id='notes'
							name='notes'
							label='Notes'
							type='text'
							multiline
							rows={7.3}
							variant='outlined'
							fullWidth
							sx={{ mt: 2 }}
						/>
					</Box>
					{/* Line Items Section */}
					<Box>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								margin: '0 auto 1rem auto',
								width: '90%',
								backgroundColor: '#fbfbfbf9',
								borderRight: '1px solid lightgray',
								borderLeft: '1px solid lightgray',
								borderBottom: '1px solid #ecececf9',
								borderTop: '1px solid #ecececf9',
								padding: '10px',
								borderRadius: '10px',
							}}
						>
							<Box sx={{ width: '32rem' }}>
								<Typography variant='h6'>Line Items</Typography>
								<TextField
									id='item'
									name='item'
									label='Item'
									type='text'
									variant='outlined'
									fullWidth
									sx={{ mt: 1, backgroundColor: 'white' }}
								/>
								<TextField
									id='item'
									name='item'
									label='Item'
									type='text'
									variant='outlined'
									fullWidth
									sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
								/>
								<TextField
									id='item'
									name='item'
									label='Item'
									type='text'
									variant='outlined'
									fullWidth
									sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
								/>
								<TextField
									id='item'
									name='item'
									label='Item'
									type='text'
									variant='outlined'
									fullWidth
									sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
								/>
								<TextField
									id='item'
									name='item'
									label='Item'
									type='text'
									variant='outlined'
									fullWidth
									sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
								/>
								<TextField
									id='item'
									name='item'
									label='Item'
									type='text'
									variant='outlined'
									fullWidth
									sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
								/>
								<TextField
									id='item'
									name='item'
									label='Item'
									type='text'
									variant='outlined'
									fullWidth
									sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
								/>
							</Box>
							<Box sx={{ width: '5rem' }}>
								<Typography variant='h6'>Quantity</Typography>
								<TextField
									id='quantity'
									name='quantity'
									label='Qty'
									type='text'
									variant='outlined'
									fullWidth
									sx={{ mt: 1, backgroundColor: 'white' }}
								/>
								<TextField
									id='quantity'
									name='quantity'
									label='Qty'
									type='text'
									variant='outlined'
									fullWidth
									sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
								/>
								<TextField
									id='quantity'
									name='quantity'
									label='Qty'
									type='text'
									variant='outlined'
									fullWidth
									sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
								/>
								<TextField
									id='quantity'
									name='quantity'
									label='Qty'
									type='text'
									variant='outlined'
									fullWidth
									sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
								/>
								<TextField
									id='quantity'
									name='quantity'
									label='Qty'
									type='text'
									variant='outlined'
									fullWidth
									sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
								/>
								<TextField
									id='quantity'
									name='quantity'
									label='Qty'
									type='text'
									variant='outlined'
									fullWidth
									sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
								/>
								<TextField
									id='quantity'
									name='quantity'
									label='Qty'
									type='text'
									variant='outlined'
									fullWidth
									sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
								/>
							</Box>
						</Box>
					</Box>
					{/* Payment Section */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'flex-start',
							margin: '0 auto',
							width: '90%',
							backgroundColor: '#fbfbfbf9',
							borderRight: '1px solid lightgray',
							borderLeft: '1px solid lightgray',
							borderBottom: '1px solid #ecececf9',
							borderTop: '1px solid #ecececf9',
							padding: '10px',
							borderRadius: '10px',
						}}
					>
						{/* Amount Total Labels */}
						<Box sx={{ width: '25rem' }}>
							<Typography variant='h6'>Payment Type</Typography>
							<TextField
								id='cash'
								name='cash'
								label='Cash'
								type='text'
								variant='outlined'
								fullWidth
								value='Cash'
								InputProps={{
									readOnly: true,
								}}
								sx={{ mt: 1, backgroundColor: 'white' }}
							/>
							<TextField
								id='credit'
								name='credit'
								label='Credit'
								type='text'
								variant='outlined'
								fullWidth
								value='Credit'
								InputProps={{
									readOnly: true,
								}}
								sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
							/>
							<TextField
								id='debit'
								name='debit'
								label='Debit'
								type='text'
								variant='outlined'
								fullWidth
								value='Debit'
								InputProps={{
									readOnly: true,
								}}
								sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
							/>
							<TextField
								id='customerCredit'
								name='customerCredit'
								label='Customer Credit'
								type='text'
								variant='outlined'
								fullWidth
								value='Customer Credit'
								InputProps={{
									readOnly: true,
								}}
								sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
							/>
							<TextField
								id='taxes'
								name='taxes'
								label='Taxes'
								type='text'
								variant='outlined'
								fullWidth
								value='Taxes'
								InputProps={{
									readOnly: true,
								}}
								sx={{
									mt: 3,
									backgroundColor: 'white',
									outline: '1px solid red',
									borderRadius: '8px',
								}}
							/>
							<TextField
								id='subtotal'
								name='subtotal'
								label='Subtotal'
								type='text'
								variant='outlined'
								fullWidth
								value='Subtotal'
								InputProps={{
									readOnly: true,
								}}
								sx={{
									backgroundColor: 'white',
									outline: '1px solid red',
									borderRadius: '8px',
									marginTop: '.25rem',
								}}
							/>
							<TextField
								id='total'
								name='total'
								label='Total'
								type='text'
								variant='outlined'
								fullWidth
								value='Total'
								InputProps={{
									readOnly: true,
								}}
								sx={{
									backgroundColor: 'lavenderblush',
									outline: '1px solid red',
									borderRadius: '8px',
									marginTop: '.25rem',
								}}
							/>
						</Box>
						{/* Amount Total Numbers */}
						<Box sx={{ width: '20%' }}>
							<Typography variant='h6'>Amount</Typography>
							{/* Cash Amount */}
							<TextField
								id='cashAmount'
								name='cashAmount'
								label='Amount'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ mt: 1, backgroundColor: 'white' }}
							/>
							{/* Credit Amount */}
							<TextField
								id='creditAmount'
								name='creditAmount'
								label='Amount'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
							/>
							{/* Debit Amount */}
							<TextField
								id='debitAmount'
								name='debitAmount'
								label='Amount'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
							/>
							{/* Customer Credit Amount */}
							<TextField
								id='customerCreditAmount'
								name='customerCreditAmount'
								label='Amount'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
							/>
							{/* Tax Amount */}
							<TextField
								id='taxAmount'
								name='taxAmount'
								label='Amount'
								fullWidth
								InputProps={{
									readOnly: true,
								}}
								variant='outlined'
								type='text'
								sx={{
									mt: 3,
									backgroundColor: 'white',
									outline: '1px solid red',
									borderRadius: '8px',
								}}
							/>
							{/* SubTotal Amount */}
							<TextField
								id='subTotalAmount'
								name='subTotalAmount'
								label='Amount'
								fullWidth
								variant='outlined'
								type='text'
								InputProps={{
									readOnly: true,
								}}
								sx={{
									backgroundColor: 'white',
									outline: '1px solid red',
									borderRadius: '8px',
									marginTop: '.25rem',
								}}
							/>
							{/* Total Amount */}
							<TextField
								id='totalAmount'
								name='totalAmount'
								label='Amount'
								fullWidth
								variant='outlined'
								type='text'
								value={totalAmount}
								onChange={(event) => setTotalAmount(event.target.value)}
								sx={{
									backgroundColor: 'lavenderblush',
									outline: '1px solid red',
									borderRadius: '8px',
									marginTop: '.25rem',
								}}
							/>
						</Box>
					</Box>
				</Box>
				<Box>
					{/* Edit Button */}
					<Button
						className='btn-primary'
						variant='contained'
						type='submit'
						disabled={loading}
						color='primary'
						sx={{ width: '20rem', textAlign: 'center', margin: '1rem auto' }}
					>
						Save
					</Button>
				</Box>
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
