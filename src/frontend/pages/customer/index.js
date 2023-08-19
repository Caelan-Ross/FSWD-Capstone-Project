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
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { Snackbar, SnackbarContent } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
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
	const [showSnackbar, setShowSnackbar] = useState(false);

	// Data Fields
	const columns = [
		{ field: 'id', headerName: <strong>Customer ID</strong>, width: 100 },
		{ field: 'firstName', headerName: <strong>First Name</strong>, width: 300 },
		{ field: 'lastName', headerName: <strong>Last Name</strong>, width: 300 },
		{ field: 'phoneNumber', headerName: <strong>Phone No.</strong>, width: 300 },
		{ field: 'email', headerName: <strong>Email</strong>, width: 300 },
		{
			field: 'edit',
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
				setShowSnackbar(true); // Show the success Snackbar
				setTimeout(() => {
					setShowSnackbar(false); // Hide the Snackbar after 1 second
				}, 2000);
			})
			.catch((error) => {
				console.error('Error deleting customer:', error);
			});
	};

	// Send user to editCustomer.js
	const handleEdit = (customerId) => {
		router.push(`/customer/edit?id=${customerId}`);
	};

	return (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			sx={{
				backgroundColor: '#E6E8E7',
				borderRadius: '8px',
				margin: '1rem',
				padding: '2rem',
				height: '90%',
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
						Customers
					</Typography>
				</Box>
				<Box>
					<IconButton
						onClick={() => handleNavigation('/inventory/create')}
					>
						<AddCircleIcon sx={{ fontSize: '2.5rem', color: '#000000' }} />
					</IconButton>
					<IconButton onClick={() => handleNavigation('/customer/create')}>
						<SystemUpdateAltIcon sx={{ fontSize: '2.5rem', color: '#000000' }} />
					</IconButton>
				</Box>
			</Box>
			<Snackbar
				open={showSnackbar}
				autoHideDuration={1000} // 1 second
				onClose={() => setShowSnackbar(false)} // Close on click away
			>
				<SnackbarContent
					message='Customer deleted successfully'
					action={<CheckCircleOutline />}
				/>
			</Snackbar>

			{/* Customer DataGrid */}
			<div
				style={{
					height: '90%',
					padding: '.5rem',
					marginTop: theme.spacing(2),
					backgroundColor: '#fbfbfbf9',
					borderRadius: '10px'
				}}
			>
				<DataGrid rows={customerData} columns={columns} pageSize={5} sx={{alignItems: 'center', margin: 'auto'}}/>
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
