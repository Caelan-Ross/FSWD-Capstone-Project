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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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

	const handleEdit = (invoiceId) => {
		router.push(`/invoice/editInvoice?id=${invoiceId}`);
	};

	const API_BASE = 'http://localhost:7166/api/Invoices';
	const [invoiceData, setInvoiceData] = useState([]);
	const [deleteConfirmation, setDeleteConfirmation] = useState({
		open: false,
		customerId: null,
	});
	const [showSnackbar, setShowSnackbar] = useState(false);

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

	// Display Headings
	const columns = [
		{ 
			field: 'id', 
			headerName: "Invoice ID", 
			width: 100 
		},
		{
			field: 'customerFirstName',
			headerName: "First Name",
			width: 150,
		},
		{
			field: 'customerLastName',
			headerName: "Last Name",
			width: 150,
		},
		{
			field: 'paymentMethodR',
			headerName: "Payment Method",
			width: 200,
		},
		{
			field: 'dateOfSale',
			headerName: "Date of Invoice",
			width: 200,
			valueGetter: (params) => toShortDate(params.row.dateOfSale),
		},
		{
			field: 'totalPrice',
			headerName: "Total Price",
			width: 200,
		},
		{
			field: 'edit', // Edit column
			headerName: "Edit",
			width: 100,
			renderCell: (params) => (
				<IconButton onClick={() => handleEdit(params.row.id)}>
					<EditIcon />
				</IconButton>
			),
		},
		{
			field: 'delete',
			headerName: "Delete",
			width: 100,
			renderCell: (params) => (
				<IconButton onClick={() => openDeleteConfirmation(params.row.id)}>
					<DeleteIcon />
				</IconButton>
			),
		},
	];

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
					setShowSnackbar(false); // Hide the Snackbar after 1 second
				}, 2000);
			})
			.catch((error) => {
				console.error('Error deleting invoice:', error);
			});
	};

	return (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			sx={{
				backgroundColor: '#E6E8E7',
				borderRadius: '8px',
				margin: '2rem',
				padding: '2rem',
				height: '993px',
				width: '1920px',
				overflow: 'auto',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-start',
					alignItems: 'center',
					width: '100%',
				}}
			>
				<Typography
					variant='h3'
					align='center'
					component='h2'
					sx={{ marginRight: '1rem' }}
				>
					Invoices
				</Typography>
				<IconButton onClick={() => handleNavigation('/invoices/create')}>
					<AddCircleIcon sx={{ fontSize: '2.5rem', color: '#000000' }} />
				</IconButton>
			</Box>
			<Snackbar
				open={showSnackbar}
				autoHideDuration={1000} // 1 second
				onClose={() => setShowSnackbar(false)} // Close on click away
			>
				<SnackbarContent
					message='Invoice deleted successfully'
					action={<CheckCircleOutline />}
				/>
			</Snackbar>

			{/* Invoice DataGrid */}
			<div
				style={{
					height: '800px',
					width: '1300px',
					marginTop: theme.spacing(2),
					backgroundColor: '#fbfbfbf9',
					borderRadius: '10px',
				}}
			>
				<DataGrid
					rows={invoiceData}
					columns={columns}
					pageSize={5}
					autoHeight 
					sx={{ alignItems: 'center', margin: 'auto' }}
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

