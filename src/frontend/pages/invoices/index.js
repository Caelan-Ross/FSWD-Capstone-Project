import React, { useState, useEffect } from 'react';
import {
	Typography,
	Box,
	useTheme,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { Snackbar, SnackbarContent } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { useRouter } from 'next/router';
import axios from 'axios';

function toShortDate(dateString) {
	const date = new Date(dateString);
	return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export default function Invoices() {
	const theme = useTheme();
	const router = useRouter();
	const handleNavigation = (path) => {
		router.push(path);
	};

	const API_BASE = 'http://localhost:7166/api/Invoices';
	const [invoiceData, setInvoiceData] = useState([]);
	const [searchQuery, setSearchQuery] = useState([]);

	// State for alerts
	const [deleteConfirmation, setDeleteConfirmation] = useState({
		open: false,
		invoiceId: null,
	});
	const [showSnackbar, setShowSnackbar] = useState(false);
	const [showExportSnackbar, setShowExportSnackbar] = useState(false);

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

	// Send user to edit
	 const handleEdit = (invoiceId) => {
		 router.push(`/invoices/edit?id=${invoiceId}`);
	 };

	const handleView = (invoiceId) => {
		router.push(`/invoices/view?id=${invoiceId}`);
	};


	// Display Headings
	const columns = [
		{
			field: 'id',
			headerName: 'Invoice ID',
			width: 100,
		},
		{
			field: 'customerFirstName',
			headerName: 'First Name',
			width: 150,
		},
		{
			field: 'customerLastName',
			headerName: 'Last Name',
			width: 150,
		},
		{
			field: 'paymentMethodR',
			headerName: 'Payment Method',
			width: 200,
		},
		{
			field: 'dateOfSale',
			headerName: 'Date of Invoice',
			width: 200,
			valueGetter: (params) => toShortDate(params.row.dateOfSale),
		},
		{
			field: 'totalPrice',
			headerName: 'Total Price',
			width: 200,
		},
		// Delete and Edit Icons
		{
			field: 'view',
			headerName: 'view',
			width: 100,
			renderCell: (params) => (
				<IconButton onClick={() => handleView(params.row.id)}>
					<InfoIcon />
				</IconButton>
			),
		},
		{
			field: 'delete',
			headerName: 'Delete',
			width: 100,
			renderCell: (params) => (
				<IconButton onClick={() => openDeleteConfirmation(params.row.id)}>
					<DeleteIcon />
				</IconButton>
			),
		},
	];

	// Function to open the delete confirmation dialog
	const openDeleteConfirmation = (invoiceId) => {
		setDeleteConfirmation({
			open: true,
			invoiceId: invoiceId,
		});
	};

	// Function to close the delete confirmation dialog
	const closeDeleteConfirmation = () => {
		setDeleteConfirmation({
			open: false,
			invoiceId: null,
		});
	};

	// Function to delete an invoice
	const handleDelete = (invoiceId) => {
		axios
			.delete(`${API_BASE}/${invoiceId}`)
			.then((response) => {
				console.log('Invoice deleted:', response.data);
				// Remove the deleted invoice from invoiceData state
				setInvoiceData((prevData) =>
					prevData.filter((invoice) => invoice.id !== invoiceId)
				);
				closeDeleteConfirmation();
				setShowSnackbar(true); // Show the success Snackbar
				setTimeout(() => {
					setShowSnackbar(false);
				}, 2000);
			})
			.catch((error) => {
				console.error('Error deleting invoice:', error);
			});
	};

	// Function to export an invoices
	const handleExport = async () => {
		try {
			await axios.post(`${API_BASE}/Export`);
			setShowExportSnackbar(true);
			setTimeout(() => {
				setShowExportSnackbar(false);
			}, 2000);
		} catch (error) {
			console.error('Error exporting invoices:', error);
		}
	};

	// Filter invoice data based on search query
	const filteredInvoiceData = invoiceData.filter((invoice) => {
		const lowerCaseSearchQuery =
			typeof searchQuery === 'string' ? searchQuery.toLowerCase() : '';

		return (
			typeof invoice.customerFirstName === 'string' &&
			invoice.customerFirstName.toLowerCase().includes(lowerCaseSearchQuery) ||
			invoice.customerLastName.toLowerCase().includes(lowerCaseSearchQuery)
		);
	});

	// Fetch invoice and customer data
	useEffect(() => {
		axios
			.get(API_BASE)
			.then(async (response) => {
				const invoices = response.data;

				// Fetch customer names for each invoice
				const invoicesWithCustomerNames = await Promise.all(
					invoices.map(async (invoice) => {
						const customer = await fetchCustomer(invoice.customerId);
						return {
							...invoice,
							customerFirstName: customer.firstName,
							customerLastName: customer.lastName,
						};
					})
				);

				setInvoiceData(invoicesWithCustomerNames);
			})
			.catch((error) => {
				console.error('Error fetching invoice data:', error);
			});
	}, []);

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
				overflow: 'none',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					flexDirection: 'row',
					alignItems: 'center',
					width: '100%',
				}}
			>
				<Box>
					<Typography
						variant='h3'
						align='center'
						component='h2'
						sx={{ marginRight: '1rem' }}
					>
						Invoices
					</Typography>
				</Box>
				<Box>
					{/* Create Invoice Icon */}
					<IconButton onClick={() => handleNavigation('/invoices/create')}>
						<AddCircleIcon sx={{ fontSize: '2.5rem', color: '#000000' }} />
					</IconButton>
					{/* Export Invoices Icon */}
					<IconButton onClick={handleExport}>
						<SystemUpdateAltIcon
							sx={{ fontSize: '2.5rem', color: '#000000' }}
						/>
					</IconButton>
				</Box>
			</Box>
			{/* Delete Invoice message */}
			<Snackbar
				open={showSnackbar}
				autoHideDuration={2000}
				onClose={() => setShowSnackbar(false)}
			>
				<SnackbarContent
					message='Invoice deleted successfully'
					action={<CheckCircleOutline />}
				/>
			</Snackbar>
			{/* Export Invoice message */}
			<Snackbar
				open={showExportSnackbar}
				autoHideDuration={2000}
				onClose={() => setShowExportSnackbar(false)}
			>
				<SnackbarContent
					message='Invoices exported successfully'
					action={<CheckCircleOutline />}
				/>
			</Snackbar>
			<div
				style={{
					height: '90%',
					padding: '.5rem',
					marginTop: theme.spacing(2),
					backgroundColor: '#fbfbfbf9',
					borderRadius: '10px',
				}}
			>
				{/* Searchbar */}
				<TextField
					type='text'
					label='Search by name'
					variant='outlined'
					fullWidth
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					sx={{ marginBottom: theme.spacing(2) }}
				/>
				{/* Invoice DataGrid */}
				<DataGrid
					rows={filteredInvoiceData}
					columns={columns}
					autoPageSize
					sx={{ height: '40rem' }}
				/>
			</div>
			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteConfirmation.open} onClose={closeDeleteConfirmation}>
				<DialogTitle>Delete Invoice</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this invoice?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteConfirmation}>Cancel</Button>
					<Button
						onClick={() => handleDelete(deleteConfirmation.invoiceId)}
						color='primary'
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
