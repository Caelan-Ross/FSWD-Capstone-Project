import {
	Typography,
	Box,
	IconButton,
	TextField,
	Button,
	Alert,
	Select,
	MenuItem,
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

	const API_BASE = 'http://localhost:3000/api/invoices/create';
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showSnackbar, setShowSnackbar] = useState(false);
	const [customerOptions, setCustomerOptions] = useState([]);
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [taxAmount, setTaxAmount] = useState(0);
	const [subtotal, setSubtotal] = useState(0);
	const [totalAmount, setTotalAmount] = useState(0);
	const [customerCreditAmount, setCustomerCreditAmount] = useState(0);

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

		// Call handleInputChange to update the overall totals
		handleInputChange();
	};

	const addPaymentLine = () => {
		setPaymentLines([...paymentLines, { paymentType: '', amount: '' }]);
	};

	const removePaymentLine = (index) => {
		const updatedPaymentLines = [...paymentLines];
		updatedPaymentLines.splice(index, 1);
		setPaymentLines(updatedPaymentLines);
	};

	// Calculate totals of all types of payment
	const handleInputChange = () => {
		const debitTotal = parseFloat(calculatePaymentTotal('debit'));
		const creditTotal = parseFloat(calculatePaymentTotal('credit'));
		const cashTotal = parseFloat(calculatePaymentTotal('cash'));
		const customerCreditTotal =
			parseFloat(-1 * parseFloat(document.getElementById('customerCreditAmount').value)) ||
			0;

		const newSubtotal =
			cashTotal + creditTotal + debitTotal + customerCreditTotal;
		const newTaxAmount = newSubtotal * 0.05; // Calculate tax as 5% of the subtotal
		const newTotalAmount = newSubtotal + newTaxAmount;

		// Update state variables
		setCustomerCreditAmount(customerCreditTotal);
		setSubtotal(newSubtotal);
		setTaxAmount(newTaxAmount);
		setTotalAmount(newTotalAmount);
	};

	// Sum total of each type of payment (cash OR debit OR credit)
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
		} catch (error) {
			console.log(error);
			setError('Failed to create invoice');
		} finally {
			setLoading(false);
		}
	};

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

	return (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			sx={{
				borderRadius: '8px',
				margin: '.5rem auto',
				padding: '.5rem 1rem',
				height: '80vh',
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
					margin: '1rem auto 0 auto',
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
							height: '36rem'
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
							rows={6}
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
							height: '36rem'
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
								width: '24rem',
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
									onChange={(e) =>
										handleInputChangeLines(index, 'item', e.target.value)
									}
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
									onChange={(e) =>
										handleInputChangeLines(index, 'quantity', e.target.value)
									}
									sx={{ backgroundColor: 'white', width: '4rem' }}
								/>
								<IconButton onClick={addRow}>
									<AddCircleIcon
										sx={{ fontSize: '1.25rem', color: '#000000' }}
									/>
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
							height: '36rem'
						}}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								margin: '1rem auto',
								backgroundColor: '#fbfbfbf9',
								width: '20rem',
							}}
						>
							<Typography variant='h6'>Payment Type</Typography>
							<Typography variant='h6'>Amount</Typography>
						</Box>
						{/* User Select Payment Type */}
						{paymentLines.map((row, index) => (
							<Box
								key={index}
								sx={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'center',
									margin: '0 auto 0 6.15rem',
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
									onChange={(e) =>
										handleInputChangePayment(
											index,
											'paymentType',
											e.target.value
										)
									}
									sx={{ backgroundColor: 'white', width: '17rem' }}
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
									onChange={(e) =>
										handleInputChangePayment(index, 'amount', e.target.value)
									}
									sx={{ backgroundColor: 'white', width: '6rem' }}
								/>
								<IconButton onClick={addPaymentLine}>
									<AddCircleIcon
										sx={{ fontSize: '1.25rem', color: '#000000' }}
									/>
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
						))}
						{/* Customer Credit */}
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
							<TextField
								id='customerCreditLabel'
								name='customerCreditLabel'
								type='text'
								variant='outlined'
								fullWidth
								value='Customer Credit'
								InputProps={{
									readOnly: true,
								}}
								sx={{
									marginTop: '.25rem',
									backgroundColor: 'lightgreen',
									width: '17rem',
								}}
							/>
							<TextField
								id={'customerCreditAmount'}
								name={'customerCreditAmout'}
								label='$'
								type='text'
								variant='outlined'
								fullWidth
								onChange={handleInputChange}
								sx={{
									marginTop: '.25rem',
									backgroundColor: 'lightgreen',
									width: '6rem',
								}}
							/>
						</Box>
						<Typography
							variant='h6'
							sx={{
								margin: '2rem auto 0 7rem',
								backgroundColor: '#fbfbfbf9',
							}}
						>
							Totals
						</Typography>
						{/* Totals Section */}
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								margin: '1rem auto 0 auto',
								backgroundColor: '#fbfbfbf9',
							}}
						>
							{/* Debit Total */}
							<TextField
								id='debitTotal'
								name='debitTotal'
								label='Debit'
								variant='outlined'
								type='text'
								value={calculatePaymentTotal('debit')}
								InputProps={{
									readOnly: true,
								}}
								sx={{ backgroundColor: '#f3eced', width: '6rem' }}
							/>
							{/* Credit Total */}
							<TextField
								id='creditTotal'
								name='creditTotal'
								label='Credit'
								variant='outlined'
								type='text'
								value={calculatePaymentTotal('credit')}
								InputProps={{
									readOnly: true,
								}}
								sx={{
									backgroundColor: '#f3eced',
									width: '6rem',
									marginLeft: '1rem',
								}}
							/>
							{/* Cash Total */}
							<TextField
								id='cashTotal'
								name='cashTotal'
								label='Cash'
								variant='outlined'
								type='text'
								value={calculatePaymentTotal('cash')}
								InputProps={{
									readOnly: true,
								}}
								sx={{
									backgroundColor: '#f3eced',
									width: '6rem',
									marginLeft: '1rem',
								}}
							/>
							{/* Customer Credit Total */}
							<TextField
								id='customerCreditTotal'
								name='customerCreditTotal'
								label='CX Credit'
								variant='outlined'
								type='text'
								value={calculatePaymentTotal('cash')}
								InputProps={{
									readOnly: true,
								}}
								sx={{
									backgroundColor: 'lightgreen',
									width: '6rem',
									marginLeft: '1rem',
								}}
							/>
						</Box>

						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								margin: '2rem auto 0 auto',
								backgroundColor: '#fbfbfbf9',
							}}
						>
							{/* Tax Amount */}
							<TextField
								id='taxAmount'
								name='taxAmount'
								label='Tax Total'
								fullWidth
								value={taxAmount.toFixed(2)}
								InputProps={{
									readOnly: true,
								}}
								variant='outlined'
								type='text'
								sx={{
									marginTop: '.75rem',
									backgroundColor: '#f3eced',
									borderRadius: '8px',
									width: '28rem'
								}}
							/>
							{/* Subtotal Amount */}
							<TextField
								id='subTotalAmount'
								name='subTotalAmount'
								label='Sub Total'
								fullWidth
								variant='outlined'
								type='text'
								value={subtotal}
								InputProps={{
									readOnly: true,
								}}
								sx={{
									backgroundColor: '#f3eced',
									borderRadius: '8px',
									marginTop: '.75rem',
								}}
							/>
							{/* Total Amount */}
							<TextField
								id='totalAmount'
								name='totalAmount'
								label='Total'
								fullWidth
								variant='outlined'
								type='text'
								value={totalAmount}
								InputProps={{
									readOnly: true,
								}}
								sx={{
									backgroundColor: '#df9aa2',
									borderRadius: '8px',
									marginTop: '.75rem',
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
						sx={{ width: '20rem', textAlign: 'center', margin: '1rem auto 0 auto' }}
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
