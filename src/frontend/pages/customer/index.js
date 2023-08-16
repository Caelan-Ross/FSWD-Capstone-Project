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
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Customer() {
	const theme = useTheme();
	const router = useRouter();
	const handleNavigation = (path) => {
		router.push(path);
	};

	const API_BASE = 'http://localhost:7166/api/Customers';
	const [customerData, setCustomerData] = useState([]);
	const [deleteConfirmation, setDeleteConfirmation] = useState({
		open: false,
		customerId: null,
	});

	// Data Fields
	const columns = [
		{ field: 'id', headerName: 'Customer ID', width: 150 },
		{ field: 'firstName', headerName: 'First Name', width: 150 },
		{ field: 'lastName', headerName: 'Last Name', width: 150 },
		{ field: 'phoneNumber', headerName: 'Phone No.', width: 150 },
		{ field: 'email', headerName: 'Email', width: 250 },
		{
			field: 'edit',
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
				<IconButton onClick={() => openDeleteConfirmation(params.row.id)}>
					<DeleteIcon />
				</IconButton>
			),
		},
	];


	// Fetch Customer Data
	useEffect(() => {
		axios
			.get(API_BASE, {
				headers: {
					accept: 'text/plain',
				},
			})
			.then((response) => {
				console.log(response);
				// Update customerData state with fetched data
				setCustomerData(response.data);
			})
			.catch((error) => {
				console.error('Error fetching customer data:', error);
			});
	}, []);

	// Function to open the delete confirmation dialog
	const openDeleteConfirmation = (customerId) => {
		setDeleteConfirmation({
			open: true,
			customerId: customerId,
		});
	};

	// Function to close the delete confirmation dialog
	const closeDeleteConfirmation = () => {
		setDeleteConfirmation({
			open: false,
			customerId: null,
		});
	};

	// Function to delete a customer
	const handleDelete = (customerId) => {
		axios
			.delete(`${API_BASE}/${customerId}`)
			.then((response) => {
				console.log('Customer deleted:', response.data);
				// Remove the deleted customer from customerData state
				setCustomerData((prevData) =>
					prevData.filter((customer) => customer.id !== customerId)
				);
				closeDeleteConfirmation();
			})
			.catch((error) => {
				console.error('Error deleting customer:', error);
			});
	};


	// Send user to editCustomer.js
	const handleEdit = (customerId) => {
		router.push(`/customer/editCustomer?id=${customerId}`);
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
					Customer
				</Typography>
				<IconButton
					onClick={() => handleNavigation('/customer/createCustomer')}
				>
					<AddCircleIcon sx={{ fontSize: '2.5rem', color: '#000000' }} />
				</IconButton>
			</Box>

			{/* Customer DataGrid */}
			<div
				style={{
					height: '80%',
					width: '100%',
					marginTop: theme.spacing(2),
					backgroundColor: 'white',
				}}
			>
				<DataGrid rows={customerData} columns={columns} pageSize={5} />
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteConfirmation.open} onClose={closeDeleteConfirmation}>
				<DialogTitle>Delete Customer</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this customer?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteConfirmation}>Cancel</Button>
					<Button
						onClick={() => handleDelete(deleteConfirmation.customerId)}
						color='primary'
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
