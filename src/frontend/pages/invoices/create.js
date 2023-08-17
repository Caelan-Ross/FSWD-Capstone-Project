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
import axios from 'axios';
import { red } from '@mui/material/colors';

export default function Home() {
	const router = useRouter();
	const handleNavigation = (path) => {
		router.push(path);
	};

	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const API_BASE = 'http://localhost:3000/api/invoices/create';

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
			setError(null);

			await axios.post(url);
			// Display success message
			alert('Customer created successfully');
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
				outline: '1px solid lightgrey',
				borderRadius: '8px',
				margin: '2rem',
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
			<Box component='form'
				onSubmit={handleSubmit}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '100%',
					backgroundColor: '#fffffff2',
					borderRadius: '8px',
					outline: '1px solid black',
					padding: '1rem',
					justifyContent: 'space-evenly',
					alignItems: 'center',
					margin: '1rem auto'
				}}>
				<Box sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-evenly',
					alignItems: 'flex-start',
					margin: '0 auto',
					width: '100%',
					backgroundColor: '#fffffff2',
					borderRadius: '8px',
				}}>
						<Box sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'left',
						margin: '0 auto',
						width: '90%',
						backgroundColor: '#ffffff80',
						borderRadius: '8px',
					}}>
							<Typography variant='h6'>Customer/Invoice Details</Typography>
							<TextField
								id='invoiceNumber'
								name='invoiceNumber'
								label='Invoice No.'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ mt: 1, backgroundColor: 'white' }}
							/>
							<Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
								<TextField
									id='firstName'
									name='firstName'
									label='First Name'
									variant='outlined'
									type='text'
									sx={{ mt: 2, backgroundColor: 'white', width: '48%' }}
								/>
								<TextField
									id='lastName'
									name='lastName'
									label='Last Name'
									variant='outlined'
									type='text'
									sx={{ mt: 2, backgroundColor: 'white', width: '48%' }}
								/></Box>
							<Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
								<TextField
									id='email'
									name='email'
									label='Email'
									fullWidth
									variant='outlined'
									type='email'
									sx={{ mt: 2, backgroundColor: 'white', width: '48%' }}
								/>
								<TextField
									id='phoneNumber'
									name='phoneNumber'
									label='Phone Number'
									fullWidth
									variant='outlined'
									type='text'
									sx={{ mt: 2, backgroundColor: 'white', width: '48%' }}
								/></Box>
							<TextField
								id='notes'
								name='notes'
								label='Notes'
								type='text'
								multiline
								rows={7.3}
								variant='outlined'
								fullWidth
								sx={{ mt: 2}}
							/>
						</Box><Box>
						<Box sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							margin: '0 auto 1rem auto',
							width: '90%',
							backgroundColor: '#ffffff80',
							borderRadius: '8px',
						}}>
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
					<Box sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'flex-start',
						margin: '0 auto',
						width: '90%',
						backgroundColor: '#ffffff80',
						borderRadius: '8px',
					}}>
						<Box sx={{ width: '25rem' }}>
							<Typography variant='h6'>Payment Type</Typography>
							<TextField
								id='cash'
								name='cash'
								label='Cash'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ mt: 1, backgroundColor: 'white' }}
							/>
							<TextField
								id='credit'
								name='credit'
								label='Credit'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
							/>
							<TextField
								id='debit'
								name='debit'
								label='Debit'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
							/>
							<TextField
								id='customerCredit'
								name='customerCredit'
								label='Customer Credit'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
							/>
							<TextField
								id='taxes'
								name='taxes'
								label='Taxes'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ mt: 3, backgroundColor: 'white', outline: '1px solid red', borderRadius: '8px' }}
							/>
							<TextField
								id='subtotal'
								name='subtotal'
								label='Subtotal'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ backgroundColor: 'white', outline: '1px solid red', borderRadius: '8px', marginTop: '.25rem' }}
							/>
							<TextField
								id='total'
								name='total'
								label='Total'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ backgroundColor: 'lavenderblush', outline: '1px solid red', borderRadius: '8px', marginTop: '.25rem' }}
							/>
						</Box>
						<Box sx={{ width: '20%' }}>
							<Typography variant='h6'>Amount</Typography>
							<TextField
								id='amount'
								name='amount'
								label='Amount'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ mt: 1, backgroundColor: 'white' }}
							/>
							<TextField
								id='amount'
								name='amount'
								label='Amount'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
							/>
							<TextField
								id='amount'
								name='amount'
								label='Amount'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
							/>
							<TextField
								id='amount'
								name='amount'
								label='Amount'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ marginTop: '.25rem', backgroundColor: 'white' }}
							/>
							<TextField
								id='amount'
								name='amount'
								label='Amount'
								fullWidth
								variant='outlined'
								type='text'
								sx={{ mt: 3, backgroundColor: 'white', outline: '1px solid red', borderRadius: '8px' }}
							/>
							<TextField
								id='amount'
								name='amount'
								label='Amount'
								fullWidth
								variant='outlined'
								type='text'
								sx={{ backgroundColor: 'white', outline: '1px solid red', borderRadius: '8px', marginTop: '.25rem' }}
							/>
							<TextField
								id='amount'
								name='amount'
								label='Amount'
								fullWidth
								variant='outlined'
								type='text'
								sx={{ backgroundColor: 'lavenderblush', outline: '1px solid red', borderRadius: '8px', marginTop: '.25rem' }}
							/>
						</Box>
					</Box>
				</Box>
				<Box>
					<Button
						className='btn-primary'
						variant='contained'
						type='submit'
						disabled={loading}
						color='primary'
						sx={{ width: '20rem', textAlign: 'center', margin: '1rem auto' }}
					>
						{loading ? 'Submitting...' : 'Submit'}
					</Button>
				</Box>
			</Box>
		</Box>
	);
}