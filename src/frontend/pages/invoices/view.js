import React, { useState, useEffect } from 'react';
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
	const API_BASE = 'http://localhost:7166/api/Invoices'; // Update the API endpoint
	const invoiceId = router.query.id; // Get the invoiceId from the URL query parameter

	// The invoice that is to be edited
	const [invoiceDetails, setInvoiceDetails] = useState({
		id: '',
		customerId: '',
		paymentMethodR: '',
		totalPrice: 0,
		cashAmount: 0,
		debitAmount: 0,
		creditAmount: 0,
		customerCreditAmount: 0,
		taxRate: 0,
		notes: '',
		assetIds: [0],
	});

	// Storing asset data
	const [assetData, setAssetData] = useState([]);

	// Alerts
	const [isError, setIsError] = useState(null);
	const [isSuccess, setIsSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	// Customer Drop Down
	const [customerOptions, setCustomerOptions] = useState([]);
	const [selectedCustomer, setSelectedCustomer] = useState(null);

	// LineItems Drop Down
	const [lineItemOptions, setLineItemOptions] = useState([]);
	const [selectedLineItem, setSelectedLineItem] = useState([]);

	// Amounts
	const [taxRate, setTaxRate] = useState(0.05);
	const [taxAmount, setTaxAmount] = useState(0);
	const [subtotal, setSubtotal] = useState(0);
	const [totalAmount, setTotalAmount] = useState(invoiceDetails.totalPrice);
	const [customerCreditAmount, setCustomerCreditAmount] = useState(0);

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

	// Set selected customer and grab details
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
			setSubtotal(
				updatedRows.reduce((total, row) => total + (row.price || 0), 0)
			);
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

	const handleSubmit = async (event) => {
		event.preventDefault();
		const updatedInvoice = {
			...invoiceDetails,
			totalPrice: totalAmount,
		};

		try {
			// Send updated invoice details to API
			await axios.put(`${API_BASE}/${invoiceId}`, updatedInvoice);
			setIsSuccess(true);
			setTimeout(() => {
				setIsSuccess(false);
				router.push('/invoices');
			}, 1000);
		} catch (error) {
			console.error('Error updating invoice details:', error);
			setIsError(true);
		}
	};

	// Calculate the subtotal based on the line item's prices
	const calculateSubtotal = () => {
		const itemPrices = assetData.map((asset) => parseFloat(asset.price) || 0);
		const subtotal = itemPrices.reduce((total, price) => total + price, 0);
		return subtotal.toFixed(2);
	};

	// Calculate tax amount from subtotal
	const calculateTaxTotal = () => {
		const taxTotal = calculateSubtotal() * 0.05;
		return taxTotal.toFixed(2);
	};

	useEffect(() => {
		// Fetch invoice details by invoiceId
		axios
			.get(`${API_BASE}/${invoiceId}`)
			.then((response) => {
				console.log(response);
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

				// Fetch asset data for each assetId
				const assetPromises = response.data.assetIds.map((assetId) =>
					axios.get(`http://localhost:7166/api/Assets/${assetId}`)
				);

				Promise.all(assetPromises)
					.then((assetResponses) => {
						const fetchedAssetData = assetResponses.map(
							(assetResponse) => assetResponse.data
						);
						setAssetData(fetchedAssetData);
						console.log(assetData);
					})
					.catch((error) => {
						console.error('Error fetching asset data:', error);
					});

				// Initialize payment lines based on existing payment types
				const paymentTypes = ['debit', 'credit', 'cash'];
				const initialPaymentLines = paymentTypes.map((type) => {
					return {
						paymentType: type,
						amount: response.data[type + 'Amount'],
					};
				});

				// Set payment lines with initialPaymentLines
				setPaymentLines(initialPaymentLines);
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
				{isError && <Alert severity='error'>{isError}</Alert>}
				<Typography variant='h3' align='center' component='h2' className='header-text'>
					Invoice #{invoiceId}
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
						{/* Customer drop down */}
						<TextField
							id='customerId'
							name='customerId'
							label='Customer'
							variant='outlined'
							fullWidth
							value={
								selectedCustomer
									? `${selectedCustomer.firstName} ${selectedCustomer.lastName} | ${selectedCustomer.phoneNumber}`
									: ''
							}
							InputProps={{
								readOnly: true,
							}}
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
								InputProps={{
									readOnly: true,
								}}
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
								InputProps={{
									readOnly: true,
								}}
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
								InputProps={{
									readOnly: true,
								}}
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
								InputProps={{
									readOnly: true,
								}}
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
							label='Invoice Notes'
							type='text'
							multiline
							rows={7.3}
							variant='outlined'
							fullWidth
							value={invoiceDetails.notes}
							InputProps={{
								readOnly: true,
							}}
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
								backgroundColor: '#fbfbfbf9',
								width: '21rem',
								margin: '0 auto 0.5rem 6rem'
							}}
						>
							<Typography variant='h6'>Line Items</Typography>
							<Typography variant='h6'>Price</Typography>
						</Box>
						{assetData.map((asset, index) => (
							<Box sx={{display: 'flex', flexDirection: 'row'}}>
								<Grid>
									<TextField
										label='Item'
										variant='outlined'
										fullWidth
										value={asset.typeName}
										InputProps={{
											readOnly: true,
										}}
										sx={{
											backgroundColor: 'white',
											width: '18rem',
										}}
									/>
								</Grid>
								{/* price */}
								<Grid item>
									<TextField
										id={`price-${index}`}
										name={`price-${index}`}
										label='$'
										type='text'
										variant='outlined'
										fullWidth
										value={asset.price.toFixed(2)}
										InputProps={{
											readOnly: true,
										}}
										sx={{
											backgroundColor: 'white',
											width: '6rem',
										}}
									/>
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
							<Typography variant='h6' mt='8px'>
								Payment Totals
							</Typography>
						</Box>
						{/* Totals Section */}
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								margin: '0.5rem auto 0 auto',
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
								value={`${invoiceDetails.debitAmount.toFixed(2)}`}
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
								value={`${invoiceDetails.creditAmount.toFixed(2)}`}
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
								value={`${invoiceDetails.cashAmount.toFixed(2)}`}
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
								value={`${invoiceDetails.customerCreditAmount.toFixed(2)}`}
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
						<Box>
							{/* Customer Payment Total */}
							<TextField
								id='customerTotal'
								name='customerTotal'
								label='Customer Total'
								fullWidth
								value={(
									invoiceDetails.debitAmount +
									invoiceDetails.creditAmount +
									invoiceDetails.cashAmount +
									invoiceDetails.customerCreditAmount
								).toFixed(2)}
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
								value={calculateTaxTotal()}
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
								value={calculateSubtotal()}
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