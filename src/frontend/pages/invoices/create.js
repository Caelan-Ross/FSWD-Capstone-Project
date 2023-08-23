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
import { useState, useEffect } from 'react';
import { Snackbar, SnackbarContent } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import axios from 'axios';
import { red } from '@mui/material/colors';

export default function Home() {
	const router = useRouter();
	const handleNavigation = (path) => {
		router.push(path);
	};

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showSnackbar, setShowSnackbar] = useState(false);
	const [customerOptions, setCustomerOptions] = useState([]);
	const [selectedCustomer, setSelectedCustomer] = useState(null);

	const [subtotal, setSubtotal] = useState(0);
	const [taxAmount, setTaxAmount] = useState(0.05);
	const [totalAmount, setTotalAmount] = useState(0);

	const API_BASE = 'http://localhost:3000/api/invoices/create';

	useEffect(() => {
		// Fetch data for customers dropdown
		axios
			.get('http://localhost:7166/api/Customers')
			.then((response) => {
				setCustomerOptions(response.data);
			})
			.catch((error) => {
				console.error('Error fetching customers:', error);
			});
	}, []);

	const handleInputChange = () => {
		const cashAmount =
			parseFloat(document.getElementById('cashAmount').value) || 0;
		const creditAmount =
			parseFloat(document.getElementById('creditAmount').value) || 0;
		const debitAmount =
			parseFloat(document.getElementById('debitAmount').value) || 0;
		const customerCreditAmount =
			-1 * parseFloat(document.getElementById('customerCreditAmount').value) ||
			0;

		const newSubtotal =
			cashAmount + creditAmount + debitAmount + customerCreditAmount;
		const newTotalAmount = newSubtotal + newSubtotal * taxAmount;

		setSubtotal(newSubtotal);
		setTotalAmount(newTotalAmount);
	};

	// Submit Button
	const handleSubmit = async (event) => {
		event.preventDefault();
		const form = event.target;
		const url = `http://localhost:7166/api/Invoices`;
		try {
			setLoading(true);
			// Perform any additional validation or processing here if needed
			setError(null);

			var paymentMethod = '';

			if (document.getElementById('cashAmount').value != '') {
				if (paymentMethod != '') {
					paymentMethod = paymentMethod + ' | Cash';
				} else {
					paymentMethod = 'Cash';
				}
			}

			if (document.getElementById('creditAmount').value != '') {
				if (paymentMethod != '') {
					paymentMethod = paymentMethod + ' | Credit';
				} else {
					paymentMethod = 'Credit';
				}
			}

			if (document.getElementById('debitAmount').value != '') {
				if (paymentMethod != '') {
					paymentMethod = paymentMethod + ' | Debit';
				} else {
					paymentMethod = 'Debit';
				}
			}

			if (document.getElementById('customerCreditAmount').value != '') {
				if (paymentMethod != '') {
					paymentMethod = paymentMethod + ' | Customer Credit';
				} else {
					paymentMethod = 'Customer Credit';
				}
			}

			const requestData = {
				Id: 0,
				CustomerId: selectedCustomer.id,
				PaymentMethodR: paymentMethod,
				TotalPrice: totalAmount.toFixed(2),
			};

			await axios.post(url, requestData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			setShowSnackbar(true);
			setTimeout(() => {
				setShowSnackbar(false);
				router.push('/invoices');
			}, 2000);
			// Reset form fields
			form.reset();
			// Redirect to the inventory page
		} catch (error) {
			console.log(error);
			setError('Failed to create invoice');
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
				borderRadius: '8px',
				margin: '1rem',
				padding: '2rem',
				height: '92%',
				overflow: 'auto',
				backgroundColor: '#E6E8E7',
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
					Create Invoice
				</Typography>

				<Box display='flex' onClick={() => handleNavigation('/invoices')}>
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
						{/* Customer Section */}
						<Typography variant='h6'>Customer Details</Typography>
						<TextField
							select
							id='customerId'
							name='customerId'
							label='Customer'
							variant='outlined'
							fullWidth
							value={selectedCustomer ? selectedCustomer.id : ''}
							onChange={(event) => {
								const customerId = event.target.value;
								const customer = customerOptions.find(
									(option) => option.id === customerId
								);
								setSelectedCustomer(customer);
							}}
							sx={{ mt: 1, backgroundColor: 'white' }}
						>
							{customerOptions.map((option) => (
								<MenuItem key={option.id} value={option.id}>
									{option.firstName} {option.lastName}
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
									backgroundColor: '#f3eced',
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
									backgroundColor: '#f3eced',
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
									backgroundColor: '#f3dde0',
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
								onChange={handleInputChange}
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
								onChange={handleInputChange}
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
								onChange={handleInputChange}
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
								onChange={handleInputChange}
								sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
							/>
							{/* Tax Amount */}
							<TextField
								id='taxAmount'
								name='taxAmount'
								label='Amount'
								fullWidth
								value={taxAmount}
								InputProps={{
									readOnly: true,
								}}
								variant='outlined'
								type='text'
								sx={{
									mt: 3,
									backgroundColor: '#f3eced',
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
								value={subtotal.toFixed(2)}
								InputProps={{
									readOnly: true,
								}}
								sx={{
									backgroundColor: '#f3eced',
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
								value={totalAmount.toFixed(2)}
								InputProps={{
									readOnly: true,
								}}
								sx={{
									backgroundColor: '#f3dde0',
									borderRadius: '8px',
									marginTop: '.25rem',
								}}
							/>
						</Box>
					</Box>
				</Box>
				<Box>
					{/* Create Button */}
					<Button
						className='btn-primary'
						variant='contained'
						type='submit'
						disabled={loading}
						color='primary'
						sx={{ width: '20rem', textAlign: 'center', margin: '1rem auto' }}
					>
						{loading ? 'Creating...' : 'Create'}
					</Button>
				</Box>
			</Box>
			<Snackbar
				open={showSnackbar}
				autoHideDuration={2000}
				onClose={() => setShowSnackbar(false)}
			>
				<SnackbarContent
					message='Invoice created successfully'
					action={<CheckCircleOutline />}
				/>
			</Snackbar>
		</Box>
	);
}
