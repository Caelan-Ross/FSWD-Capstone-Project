import {
	Typography,
	Box,
	IconButton,
	TextField,
	Button,
	Alert,
	Select,
	MenuItem
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Snackbar, SnackbarContent } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import axios from 'axios';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Autocomplete from '@mui/material/Autocomplete';

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



	// State for Line Items form

	const [rows, setRows] = useState([
		{
			item: '',
			quantity: '',
		},
	]);

	const handleInputChangeLines = (index, field, value) => {
		const updatedRows = [...rows];
		updatedRows[index][field] = value;
		setRows(updatedRows);
	};

	const addRow = () => {
		setRows([...rows, { item: '', quantity: '' }]);
	};

	const removeRow = (index) => {
		const updatedRows = [...rows];
		updatedRows.splice(index, 1);
		setRows(updatedRows);
	};

	// State for Payment form
	const [paymentLines, setPaymentLines] = useState([
		{
			paymentType: '',
			amount: '',
		},
	]);

	const handleInputChangePayment = (index, field, value) => {
		const updatedPaymentLines = [...paymentLines];
		updatedPaymentLines[index][field] = value;
		setPaymentLines(updatedPaymentLines);
	};

	const addPaymentLine = () => {
		setPaymentLines([...paymentLines, { paymentType: '', amount: '' }]);
	};


	const removePaymentLine = (index) => {
		const updatedPaymentLines = [...paymentLines];
		updatedPaymentLines.splice(index, 1);
		setPaymentLines(updatedPaymentLines);
	};

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

	// const [taxAmount, setTaxAmount] = useState(0); // Initialize with 0, the value will be calculated
	// const [subtotal, setSubtotal] = useState(0); // Initialize with 0, the value will be calculated
	// const [totalAmount, setTotalAmount] = useState(0); // Initialize with 0, the value will be calculated

	// Calculate totals
	const handleInputChange = () => {
		const debitTotal = calculatePaymentTotal('debit');
		const creditTotal = calculatePaymentTotal('credit');
		const cashTotal = calculatePaymentTotal('cash');
		const customerCreditAmount = -1 * parseFloat(document.getElementById('customerCreditAmount').value) || 0;

		const newSubtotal = cashTotal + creditTotal + debitTotal + customerCreditAmount;
		const newTaxAmount = newSubtotal * 0.05; // Calculate tax as 5% of the subtotal
		const newTotalAmount = newSubtotal + newTaxAmount;

		// Update state variables
		setSubtotal(newSubtotal);
		setTaxAmount(newTaxAmount);
		setTotalAmount(newTotalAmount);
	};


	const calculatePaymentTotal = (paymentType, currentAmount = 0) => {
		let total = 0;

		paymentLines.forEach((line) => {
			if (line.paymentType === paymentType) {
				total += parseFloat(line.amount) || 0;
			}
		});

		total += currentAmount;
		return total.toFixed(2);
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
							width: '40rem',
							backgroundColor: '#fbfbfbf9',
							borderRight: '1px solid lightgray',
							borderLeft: '1px solid lightgray',
							borderBottom: '1px solid #ecececf9',
							borderTop: '1px solid #ecececf9',
							padding: '10px',
							borderRadius: '10px',
							height: '45rem',
						}}
					>
						{/* Customer Section */}
						<Typography variant='h6'>Customer Details</Typography>
						<Autocomplete
							id='customerId'
							name='customerId'
							options={customerOptions}
							getOptionLabel={(option) =>
								`${option.firstName} ${option.lastName} | ${option.phoneNumber}`
							}
							value={selectedCustomer}
							onChange={(event, newValue) => {
								setSelectedCustomer(newValue);
							}}
							filterOptions={(options, state) => {
								const inputValue = state.inputValue.toLowerCase();
								return options.filter(
									(option) =>
										option.firstName.toLowerCase().includes(inputValue) ||
										option.lastName.toLowerCase().includes(inputValue) ||
										option.phoneNumber.includes(inputValue)
								);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label='Customer'
									variant='outlined'
									fullWidth
								/>
							)}
							sx={{ mt: 1, backgroundColor: 'white' }}
						/>

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
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							margin: '0 auto',
							width: '40rem',
							backgroundColor: '#fbfbfbf9',
							borderRight: '1px solid lightgray',
							borderLeft: '1px solid lightgray',
							borderBottom: '1px solid #ecececf9',
							borderTop: '1px solid #ecececf9',
							padding: '10px',
							borderRadius: '10px',
							overflow: 'auto',
							height: '45rem'
						}}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								margin: '0 auto',
								backgroundColor: '#fbfbfbf9',
								width: '24rem'
							}}
						>
							<Typography variant='h6'>Line Items</Typography>
							<Typography variant='h6'>Quantity</Typography>
						</Box>
						{rows.map((row, index) => (
							<Box
								key={index}
								sx={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'center',
									margin: '0 auto',
									backgroundColor: '#fbfbfbf9',
								}}
							>
								<TextField
									id={`item-${index}`}
									name={`item-${index}`}
									label='Item'
									type='text'
									variant='outlined'
									fullWidth
									value={row.item}
									onChange={(e) => handleInputChangeLines(index, 'item', e.target.value)}
									sx={{ backgroundColor: 'white', width: '24rem' }}
								/>
								<TextField
									id={`quantity-${index}`}
									name={`quantity-${index}`}
									label='Qty'
									type='text'
									variant='outlined'
									fullWidth
									value={row.quantity}
									onChange={(e) => handleInputChangeLines(index, 'quantity', e.target.value)}
									sx={{ backgroundColor: 'white', width: '4rem' }}
								/>
								<IconButton onClick={addRow}>
									<AddCircleIcon sx={{ fontSize: '1.25rem', color: '#000000' }} />
								</IconButton>
								{index > 0 && (
									<IconButton onClick={() => removeRow(index)}>
										<RemoveCircleOutlineIcon
											sx={{ fontSize: '1.25rem', color: '#000000' }}
										/>
									</IconButton>
								)}
								{index === 0 && (
									<IconButton disabled>
										<RemoveCircleOutlineIcon
											sx={{ fontSize: '1.25rem', color: '#d3d3d3' }}
										/>
									</IconButton>
								)}
							</Box>
						))}
					</Box>

					{/* Payment Section */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							margin: '0 auto',
							width: '40rem',
							backgroundColor: '#fbfbfbf9',
							borderRight: '1px solid lightgray',
							borderLeft: '1px solid lightgray',
							borderBottom: '1px solid #ecececf9',
							borderTop: '1px solid #ecececf9',
							padding: '10px',
							borderRadius: '10px',
							overflow: 'auto',
							height: '45rem'
						}}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								margin: '0 auto',
								backgroundColor: '#fbfbfbf9',
								width: '24rem'
							}}
						>
							<Typography variant='h6'>Payment Type</Typography>
							<Typography variant='h6'>Amount</Typography>
						</Box>
						{paymentLines.map((row, index) => (
							<Box
								key={index}
								sx={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'center',
									margin: '0 auto',
									backgroundColor: '#fbfbfbf9',
								}}
							>
								<Select
									id={`paymentType-${index}`}
									name={`paymentType-${index}`}
									label='Type'
									variant='outlined'
									fullWidth
									value={row.paymentType}
									onChange={(e) => handleInputChangePayment(index, 'paymentType', e.target.value)}
									sx={{ backgroundColor: 'white', width: '14rem' }}
								>
									<MenuItem value='debit'>Debit</MenuItem>
									<MenuItem value='credit'>Credit</MenuItem>
									<MenuItem value='cash'>Cash</MenuItem>
								</Select>
								<TextField
									id={`amount-${index}`}
									name={`amount-${index}`}
									label='$'
									type='text'
									variant='outlined'
									fullWidth
									value={row.amount}
									onChange={(e) => handleInputChangePayment(index, 'amount', e.target.value)}
									sx={{ backgroundColor: 'white', width: '8rem' }}
								/>
								<IconButton onClick={addPaymentLine}>
									<AddCircleIcon sx={{ fontSize: '1.25rem', color: '#000000' }} />
								</IconButton>
								{index > 0 && (
									<IconButton onClick={() => removePaymentLine(index)}>
										<RemoveCircleOutlineIcon
											sx={{ fontSize: '1.25rem', color: '#000000' }}
										/>
									</IconButton>
								)}
								{index === 0 && (
									<IconButton disabled>
										<RemoveCircleOutlineIcon
											sx={{ fontSize: '1.25rem', color: '#d3d3d3' }}
										/>
									</IconButton>
								)}
							</Box>
						))}<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								margin: '0 10.5rem 0 auto',
								backgroundColor: '#fbfbfbf9',
							}}
						><TextField
								id='customerCreditAmount'
								name='customerCreditAmount'
								type='text'
								variant='outlined'
								fullWidth
								value='Customer Credit'
								InputProps={{
									readOnly: true,
								}}
								sx={{ marginTop: '.25rem', backgroundColor: 'lightgreen', width: '14rem' }}
							/>
							<TextField
								id={`amount`}
								name={`amount`}
								label='$'
								type='text'
								variant='outlined'
								fullWidth
								onChange={handleInputChange}
								sx={{ marginTop: '.25rem', backgroundColor: 'lightgreen', width: '8rem' }}
							/>
						</Box>
						<Typography variant='h6' sx={{
							margin: '2rem auto 0 7rem',
							backgroundColor: '#fbfbfbf9',
						}}>Total</Typography>


						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								margin: '0 auto',
								backgroundColor: '#fbfbfbf9',
							}}
						>
							{/* Debit Total */}
							<TextField
								id='debitTotal'
								name='debitTotal'
								label='Debit Total'
								variant='outlined'
								type='text'
								value={calculatePaymentTotal('debit')}
								InputProps={{
									readOnly: true,
								}}
								sx={{ backgroundColor: '#f3eced', width: '10rem' }}
							/>
							{/* Credit Total */}
							<TextField
								id='creditTotal'
								name='creditTotal'
								label='Credit Total'
								variant='outlined'
								type='text'
								value={calculatePaymentTotal('credit')}
								InputProps={{
									readOnly: true,
								}}
								sx={{ backgroundColor: '#f3eced', width: '10rem', marginLeft: '1rem' }}
							/>
							{/* Cash Total */}
							<TextField
								id='cashTotal'
								name='cashTotal'
								label='Cash Total'
								variant='outlined'
								type='text'
								value={calculatePaymentTotal('cash')}
								InputProps={{
									readOnly: true,
								}}
								sx={{ backgroundColor: '#f3eced', width: '10rem', marginLeft: '1rem' }}
							/>
						</Box>


						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								margin: '0 auto',
								backgroundColor: '#fbfbfbf9',
							}}
						>
							{/* Tax Amount */}
							<Typography variant='h7' sx={{
								margin: '0 auto 0 0',
								backgroundColor: '#fbfbfbf9',
							}}>Taxes</Typography>
							<TextField
								id='taxAmount'
								name='taxAmount'
								fullWidth
								value=''
								InputProps={{
									readOnly: true,
								}}
								variant='outlined'
								type='text'
								sx={{
									mt: 1,
									backgroundColor: '#f3eced',
									borderRadius: '8px',
								}}
							/>
							{/* Subtotal Amount */}
							<Typography variant='h7' sx={{
								margin: '0 auto 0 0',
								backgroundColor: '#fbfbfbf9',
							}}>Subtotal</Typography>
							<TextField
								id='subTotalAmount'
								name='subTotalAmount'
								fullWidth
								variant='outlined'
								type='text'
								value=''
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
							<Typography variant='h7' sx={{
								margin: '0 auto 0 0',
								backgroundColor: '#fbfbfbf9',
							}}>Total</Typography>
							<TextField
								id='totalAmount'
								name='totalAmount'
								fullWidth
								variant='outlined'
								type='text'
								value=''
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
