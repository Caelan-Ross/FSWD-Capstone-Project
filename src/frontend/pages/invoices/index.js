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


	// Temporary invoice edit function
	// WILL BE REDIRECTING TO CUSTOMER, THIS IS FOR PROTOTYPE/TESTING PURPOSES**

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


	const columns = [
		{ field: 'id', headerName: 'Invoice ID', width: 150 },
		{ field: 'paymentMethod', headerName: 'Payment Method', width: 150 },
		{ field: 'dateOfSale', headerName: 'Date of Invoice', width: 150 },
		{ field: 'totalPrice', headerName: 'Total Amount', width: 250 },
		{
			field: 'edit', // Edit column
			headerName: 'Edit',
			width: 100,
			renderCell: (params) => (
				<IconButton onClick={() => handleEdit(params.row.id)}>
					<EditIcon />
				</IconButton>
			),
		},
		{
			field: 'delete',
			headerName: 'Delete',
			width: 100,
			renderCell: (params) => (
				<IconButton onClick={() => handleDelete(params.row.id)}>
					<DeleteIcon />
				</IconButton>
			),
		},
	];

	// Fetch Invoice Data
	useEffect(() => {
		axios
			.get(API_BASE, {
				headers: {
					accept: 'text/plain',
				},
			})
			.then((response) => {
				console.log(response);
				// Update invoiceData state with fetched data
				setInvoiceData(response.data);
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
				outline: '1px solid lightgrey',
				borderRadius: '8px',
				margin: '2rem',
				padding: '2rem',
				height: '94%',
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
				<IconButton onClick={() => handleNavigation('/invoices/createInvoice')}>
					<AddCircleIcon sx={{ fontSize: '2.5rem', color: '#000000' }} />
				</IconButton>
			</Box>
			<Box textAlign='left' mt={2}>
				<Typography variant='body1' component='p'>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reiciendis
					neque consequuntur in tempora, placeat ullam nihil praesentium
					reprehenderit quaerat, numquam quibusdam repellendus quidem tempore
					temporibus quas est? Nesciunt, recusandae et.
				</Typography>
			</Box>

			{/* Invoice DataGrid */}
			<div
				style={{
					height: '80%',
					width: '100%',
					marginTop: theme.spacing(2),
					backgroundColor: 'white',
				}}
			>
				<DataGrid rows={invoiceData} columns={columns} pageSize={5} />
			</div>
		</Box>
	);
}
