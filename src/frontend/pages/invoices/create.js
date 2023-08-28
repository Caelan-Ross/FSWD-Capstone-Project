import {
	Typography,
	Box,
	IconButton,
	TextField,
	Button,
	Alert,
	Select,
	MenuItem,
	Grid,
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
	const API_BASE = 'http://localhost:7166/api/Invoices/';

	// Alerts
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showSnackbar, setShowSnackbar] = useState(false);

	// Customer Drop Down
	const [customerOptions, setCustomerOptions] = useState([]);
	const [selectedCustomer, setSelectedCustomer] = useState(null);

	// Invoice Notes
	const [notes, setNotes] = useState('');

	// LineItems Drop Down
	const [lineItemOptions, setLineItemOptions] = useState([]);
	const [selectedLineItem, setSelectedLineItem] = useState([]);

	// Amounts
	const [taxAmount, setTaxAmount] = useState(0);
	const [subtotal, setSubtotal] = useState(0);
	const [totalAmount, setTotalAmount] = useState(0);
	const [customerCreditAmount, setCustomerCreditAmount] = useState(0);

	// State for Line Items form
	const [rows, setRows] = useState([
		{
			item: '',
			price: 0,
		},
	]);

	const handleInputChangeLines = (index, field, value) => {
		const updatedRows = [...rows];
		if (field === 'item') {
			updatedRows[index]['item'] = value;
			// Fetch and update the price from the selected line item
			const selectedPrice =
				lineItemOptions.find((item) => item.id === value.id)?.price || 0;
			updatedRows[index]['price'] = selectedPrice;
			handleInputChange(); // Recalculate based on new prices
		} else {
			updatedRows[index][field] = value;
		}
		setRows(updatedRows);
	};
	const addRow = () => {
		setRows([...rows, { item: '', price: '' }]);
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
		// const debitTotal = parseFloat(calculatePaymentTotal('debit'));
		// const creditTotal = parseFloat(calculatePaymentTotal('credit'));
		// const cashTotal = parseFloat(calculatePaymentTotal('cash'));
		const customerCreditTotal =
			parseFloat(
				1 * parseFloat(document.getElementById('customerCreditAmount').value)
			) || 0;

		const itemPrices = rows.map((row) => parseFloat(row.price) || 0);
		const itemsSubtotal = itemPrices.reduce((total, price) => total + price, 0);

		const newSubtotal = itemsSubtotal - customerCreditTotal;
		const newTaxAmount = parseFloat(newSubtotal) * 0.05;
		const newTotalAmount = parseFloat(newSubtotal) + parseFloat(newTaxAmount);

		// Update state variables
		setCustomerCreditAmount(customerCreditTotal);
		setSubtotal(parseFloat(newSubtotal));
		setTaxAmount(parseFloat(newTaxAmount));
		setTotalAmount(parseFloat(newTotalAmount));
	};

	const handlePriceChange = (index, newPrice) => {
		const newRows = [...rows];
		newRows[index].price = newPrice;
		setRows(newRows);
		handleInputChange(); // Recalculate based on new prices
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
		const url = `http://localhost:7166/api/Invoices`;
		try {
			setLoading(true);
			setError(null);

			const paymentMethod = [];

			if (calculatePaymentTotal('cash') > 0) {
				paymentMethod.push('Cash');
			}

			if (calculatePaymentTotal('credit') > 0) {
				paymentMethod.push('Credit');
			}

			if (calculatePaymentTotal('debit') > 0) {
				paymentMethod.push('Debit');
			}

			if (customerCreditAmount > 0) {
				paymentMethod.push('Customer Credit');
			}

			// Calculate line items data
			const assetsData = rows.map((row) => row.item.id);

			const requestData = {
				id: 0,
				firstName: selectedCustomer ? selectedCustomer.firstName : '',
				lastName: selectedCustomer ? selectedCustomer.lastName : '',
				phoneNumber: selectedCustomer ? selectedCustomer.phoneNumber : '',
				email: selectedCustomer ? selectedCustomer.email : '',
				paymentMethodR: paymentMethod.join(', '),
				cashAmount: calculatePaymentTotal('cash'),
				debitAmount: calculatePaymentTotal('debit'),
				creditAmount: calculatePaymentTotal('credit'),
				customerCreditAmount: customerCreditAmount,
				taxRate: 0.05,
				notes: notes,
				totalPrice: totalAmount,
				assetIds: assetsData,
			};

			console.log(requestData);

			const response = await axios.post(url, requestData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (
				response.status === 200 ||
				response.status === 201 ||
				response.status === 204
			) {
				setShowSnackbar(true);
				setTimeout(() => {
					setShowSnackbar(false);
					router.push('/invoices');
				}, 2000);
			} else {
				setError('Failed to create invoice');
			}
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
				// Add the "Create New Customer" option at the beginning
				const optionsWithNewCustomer = [
					{
						id: -1,
						firstName: '',
						lastName: '',
						phoneNumber: '',
						email: '',
					},
					...response.data,
				];
				setCustomerOptions(optionsWithNewCustomer);
			})
			.catch((error) => {
				console.error('Error fetching customers:', error);
			});

		// Fetch data for lineItem dropdown
		axios
			.get('http://localhost:7166/api/Assets')
			.then((response) => {
				setLineItemOptions(response.data);
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
					{/* Customer Section */}
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
							height: '36rem',
						}}
					>
						<Typography variant='h6'>Customer Details</Typography>
						{/* Customer Dropdown */}
						<Autocomplete
							id='customerId'
							name='customerId'
							options={customerOptions}
							getOptionLabel={(option) =>
								option.id === -1
									? 'Create New Customer'
									: `${option.firstName} ${option.lastName} | ${option.phoneNumber}`
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
								onChange={(e) =>
									setSelectedCustomer({
										...selectedCustomer,
										firstName: e.target.value,
									})
								}
								InputLabelProps={{
									shrink:
										selectedCustomer && selectedCustomer.firstName
											? true
											: false,
								}}
								disabled={
									selectedCustomer && selectedCustomer.id === -1 ? false : true
								}
								sx={{ mt: 2, backgroundColor: 'white', width: '48%' }}
							/>
							<TextField
								id='lastName'
								name='lastName'
								label='Last Name'
								variant='outlined'
								type='text'
								value={selectedCustomer ? selectedCustomer.lastName : ''}
								onChange={(e) =>
									setSelectedCustomer({
										...selectedCustomer,
										lastName: e.target.value,
									})
								}
								InputLabelProps={{
									shrink:
										selectedCustomer && selectedCustomer.lastName
											? true
											: false,
								}}
								disabled={
									selectedCustomer && selectedCustomer.id === -1 ? false : true
								}
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
								onChange={(e) =>
									setSelectedCustomer({
										...selectedCustomer,
										email: e.target.value,
									})
								}
								InputLabelProps={{
									shrink:
										selectedCustomer && selectedCustomer.email ? true : false,
								}}
								disabled={
									selectedCustomer && selectedCustomer.id === -1 ? false : true
								}
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
								onChange={(e) =>
									setSelectedCustomer({
										...selectedCustomer,
										phoneNumber: e.target.value,
									})
								}
								InputLabelProps={{
									shrink:
										selectedCustomer && selectedCustomer.phoneNumber
											? true
											: false,
								}}
								disabled={
									selectedCustomer && selectedCustomer.id === -1 ? false : true
								}
								sx={{ mt: 2, backgroundColor: 'white', width: '48%' }}
							/>
						</Box>
						<TextField
							id='notes'
							name='notes'
							label='Invoice Notes'
							type='text'
							multiline
							rows={6}
							variant='outlined'
							fullWidth
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
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
							height: '36rem',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								margin: '0 auto 0.3rem 3.5rem',
								backgroundColor: '#fbfbfbf9',
								width: '20.85rem',
							}}
						>
							<Typography variant='h6'>Line Items</Typography>
							<Typography variant='h6'>Price</Typography>
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
								<Grid container alignItems='center'>
									<Grid item>
										<Autocomplete
											id={`item-${index}`}
											name={`item-${index}`}
											options={lineItemOptions}
											getOptionLabel={(option) => option.batteryName}
											value={row.item}
											onChange={(event, newValue) => {
												setSelectedLineItem(newValue);
												handleInputChangeLines(index, 'item', newValue);
												const selectedPrice = newValue
													? newValue.price.toFixed(2)
													: '';
												handleInputChangeLines(index, 'price', selectedPrice);
											}}
											renderInput={(params) => (
												<TextField
													{...params}
													label='Item'
													variant='outlined'
													fullWidth
													sx={{
														backgroundColor: 'white',
														width: '18rem',
													}}
												/>
											)}
											inputValue={row.item ? row.item.batteryName : ''}
											sx={{
												'& .MuiAutocomplete-clearIndicator': {
													display: 'none',
												},
											}}
										/>
									</Grid>
									{/* price */}
									<Grid item>
										<TextField
											disabled
											id={`price-${index}`}
											name={`price-${index}`}
											label='$'
											type='text'
											variant='outlined'
											fullWidth
											value={row.price}
											onChange={(e) => handlePriceChange(index, e.target.value)} // Call handlePriceChange
											sx={{
												backgroundColor: 'white',
												width: '6rem',
											}}
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
									</Grid>
								</Grid>
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
							height: '36rem',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								margin: '0 auto 0 4.5rem',
								backgroundColor: '#fbfbfbf9',
								width: '20.25rem',
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
									onChange={(e) =>
										handleInputChangePayment(
											index,
											'paymentType',
											e.target.value
										)
									}
									sx={{ backgroundColor: 'white', width: '16rem' }}
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
									width: '16rem',
								}}
							/>
							<TextField
								id={'customerCreditAmount'}
								name={'customerCreditAmount'}
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
							<IconButton disabled>
								<AddCircleIcon sx={{ fontSize: '1.25rem', color: '#d3d3d3' }} />
							</IconButton>

							<IconButton disabled>
								<RemoveCircleOutlineIcon
									sx={{ fontSize: '1.25rem', color: '#d3d3d3' }}
								/>
							</IconButton>
						</Box>
						<Typography
							variant='h6'
							sx={{
								margin: '2rem auto 0 4.25rem',
								width: '20.25rem',
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
								value={customerCreditAmount}
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
									width: '28rem',
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
								value={subtotal.toFixed(2)}
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
								value={totalAmount.toFixed(2)}
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
						sx={{
							width: '20rem',
							textAlign: 'center',
							margin: '1rem auto 0 auto',
						}}
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
