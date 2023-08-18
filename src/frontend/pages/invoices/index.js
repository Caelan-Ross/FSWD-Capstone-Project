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
		{ field: 'id', headerName: <strong>Invoice ID</strong>, width: 100 },
		{
			field: 'customerFirstName',
			headerName: <strong>First Name</strong>,
			width: 150,
		},
		{
			field: 'customerLastName',
			headerName: <strong>Last Name</strong>,
			width: 150,
		},
		{
			field: 'paymentMethodR',
			headerName: <strong>Payment Method</strong>,
			width: 200,
		},
		{
			field: 'dateOfSale',
			headerName: <strong>Date of Invoice</strong>,
			width: 200,
		},
		{
			field: 'totalPrice',
			headerName: <strong>Total Price</strong>,
			width: 200,
		},
		{
			field: 'edit', // Edit column
			headerName: <strong>Edit</strong>,
			width: 100,
			renderCell: (params) => (
				<IconButton onClick={() => handleEdit(params.row.id)}>
					<EditIcon />
				</IconButton>
			),
		},
		{
			field: 'delete',
			headerName: <strong>Delete</strong>,
			width: 100,
			renderCell: (params) => (
				<IconButton onClick={() => handleDelete(params.row.id)}>
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
				height: '92%',
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

			{/* Invoice DataGrid */}
			<div
				style={{
					height: '90%',
					width: '95%',
					marginTop: theme.spacing(2),
					backgroundColor: '#fbfbfbf9',
					borderRadius: '10px',
				}}
			>
				<DataGrid
					rows={invoiceData}
					columns={columns}
					pageSize={5}
					sx={{ alignItems: 'center', width: '100%', margin: 'auto' }}
				/>
			</div>
		</Box>
	);
}
