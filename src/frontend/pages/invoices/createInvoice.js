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
				mt={12}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: '90%',
					backgroundColor: '#ffffff80',
					borderRadius: '8px',
					outline: '1px solid black',
					padding: '2rem',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}>
				<Box sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					margin: '0 auto',
					width: '100%',
					backgroundColor: '#ffffff80',
					borderRadius: '8px',
				}}>
					<Box sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						margin: '0 auto',
						width: '49%',
						height: '40rem',
						backgroundColor: '#ffffff80',
						borderRadius: '8px',
					}}>
						<Box sx={{ width: '100%'}}>
						<Typography variant='h6'>Customer/Invoice Details</Typography>
							<TextField
								id='invoiceNumber'
								name='invoiceNumber'
								label='Invoice No.'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ mt: 2, backgroundColor: 'white' }}
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
								rows={11}
								variant='outlined'
								fullWidth
								sx={{ mt: 2}}
							/>
						</Box>
					</Box>
					<Box sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						margin: '0 auto',
						width: '49%',
						height: '40rem',
						backgroundColor: '#ffffff80',
						borderRadius: '8px',
					}}>
						<Box sx={{ width: '85%' }}>
							<Typography variant='h6'>Payment Type</Typography>
							<TextField
								id='cash'
								name='cash'
								label='Cash'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ mt: 2, backgroundColor: 'white' }}
							/>
							<TextField
								id='credit'
								name='credit'
								label='Credit'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ backgroundColor: 'white' }}
							/>
							<TextField
								id='debit'
								name='debit'
								label='Debit'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ backgroundColor: 'white' }}
							/>
							<TextField
								id='customerCredit'
								name='customerCredit'
								label='Customer Credit'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ backgroundColor: 'white' }}
							/>
							<TextField
								id='taxes'
								name='taxes'
								label='Taxes'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ mt: 4, backgroundColor: 'white', outline: '1px solid red', borderRadius: '8px' }}
							/>
							<TextField
								id='subtotal'
								name='subtotal'
								label='Subtotal'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ backgroundColor: 'white', outline: '1px solid red', borderRadius: '8px' }}
							/>
							<TextField
								id='total'
								name='total'
								label='Total'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ mt: 4, mb: 4, backgroundColor: 'lavenderblush', outline: '1px solid red', borderRadius: '8px'  }}
							/>
						</Box>
						<Box sx={{ width: '15%' }}>
						<Typography variant='h6'>Amount</Typography>
							<TextField
								id='amount'
								name='amount'
								label='Amount'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ mt: 2, backgroundColor: 'white' }}
							/>
							<TextField
								id='amount'
								name='amount'
								label='Amount'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ backgroundColor: 'white' }}
							/>
							<TextField
								id='amount'
								name='amount'
								label='Amount'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ backgroundColor: 'white' }}
							/>
							<TextField
								id='amount'
								name='amount'
								label='Amount'
								type='text'
								variant='outlined'
								fullWidth
								sx={{ backgroundColor: 'white' }}
							/>
							<TextField
								id='amount'
								name='amount'
								label='Amount'
								fullWidth
								variant='outlined'
								type='text'
								sx={{ mt: 4, backgroundColor: 'white', outline: '1px solid red', borderRadius: '8px'  }}
							/>
							<TextField
								id='amount'
								name='amount'
								label='Amount'
								fullWidth
								variant='outlined'
								type='text'
								sx={{ backgroundColor: 'white', outline: '1px solid red', borderRadius: '8px'  }}
							/>
							<TextField
								id='amount'
								name='amount'
								label='Amount'
								fullWidth
								variant='outlined'
								type='text'
								sx={{ mt: 4, mb: 4, backgroundColor: 'lavenderblush', outline: '1px solid red', borderRadius: '8px'  }}
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
						sx={{ mt: 3, width: '20rem', textAlign: 'center', margin: '1rem auto' }}
					>
						{loading ? 'Submitting...' : 'Submit'}
					</Button>
				</Box>
			</Box>
		</Box>
	);
}