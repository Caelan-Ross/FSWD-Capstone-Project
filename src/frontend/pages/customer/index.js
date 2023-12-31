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
	TextField
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
	const [searchQuery, setSearchQuery] = useState('');

	// State for alerts
	const [showSnackbar, setShowSnackbar] = useState(false);
	const [showExportSnackbar, setShowExportSnackbar] = useState(false);
	const [deleteConfirmation, setDeleteConfirmation] = useState({
		open: false,
		customerId: null,
	});


	// Data Fields
	const columns = [
		{ field: 'id', headerName: 'Customer ID', width: 100 },
		{ field: 'firstName', headerName: 'First Name', width: 300 },
		{ field: 'lastName', headerName: 'Last Name', width: 300 },
		{
			field: 'phoneNumber',
			headerName: 'Phone No.',
			width: 300,
		},
		{ field: 'email', headerName: 'Email', width: 300 },
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
			  <IconButton onClick={() => openDeleteConfirmation(params.row.id, params.row.firstName)}>
				<DeleteIcon />
			  </IconButton>
			),
		  },
	];

	// Function to open the delete confirmation dialog
	const openDeleteConfirmation = (customerId, firstName) => {
		setDeleteConfirmation({
		  open: true,
		  customerId: customerId,
		  expectedFirstName: firstName,
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
				setCustomerData((prevData) =>
					prevData.filter((customer) => customer.id !== customerId)
				);
				closeDeleteConfirmation();
				setShowSnackbar(true);
				setTimeout(() => {
					setShowSnackbar(false);
				}, 2000);
			})
			.catch((error) => {
				console.error('Error deleting customer:', error);
			});
	};

	const [enteredFirstName, setEnteredFirstName] = useState('');
	const expectedFirstName = '';


	const handleDeleteConfirm = (event) => {
		setEnteredFirstName(event.target.value);
	};

	// Send user to editCustomer.js
	const handleEdit = (customerId) => {
		router.push(`/customer/edit?id=${customerId}`);
	};

	// Function to export customers
	const handleExport = async () => {
		try {
			await axios.post(`${API_BASE}/Export`);
			setShowExportSnackbar(true);
			setTimeout(() => {
				setShowExportSnackbar(false);
			}, 2000);
		} catch (error) {
			console.error('Error exporting customers:', error);
		}
	};

	// Filter customer data based on search query
	const filteredCustomerData = customerData.filter((customer) => {
		const lowerCaseSearchQuery = searchQuery.toLowerCase();
		return (
			customer.firstName.toLowerCase().includes(lowerCaseSearchQuery) ||
			customer.lastName.toLowerCase().includes(lowerCaseSearchQuery) ||
			customer.phoneNumber.includes(searchQuery)
		);
	});

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
						className='header-text'
						variant='h3'
						align='center'
						component='h2'
						sx={{ marginRight: '1rem' }}
					>
						Customers
					</Typography>
				</Box>
				<Box>
					{/* Create Customer Icon */}
					<IconButton onClick={() => handleNavigation('/customer/create')}>
						<AddCircleIcon sx={{ fontSize: '2.5rem', color: '#000000' }} />
					</IconButton>
					{/* Export Customers Icon */}
					<IconButton onClick={handleExport}>
						<SystemUpdateAltIcon
							sx={{ fontSize: '2.5rem', color: '#000000' }}
						/>
					</IconButton>
				</Box>
			</Box>
			{/* Delete Snackbar message */}
			<Snackbar
				open={showSnackbar}
				autoHideDuration={2000}
				onClose={() => setShowSnackbar(false)}
			>
				<SnackbarContent
					message='Customer deleted successfully'
					action={<CheckCircleOutline />}
				/>
			</Snackbar>
			{/* Export Snackbar message */}
			<Snackbar
				open={showExportSnackbar}
				autoHideDuration={2000}
				onClose={() => setShowExportSnackbar(false)}
			>
				<SnackbarContent
					message='Customers exported successfully'
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
					label='Search by name or phone number'
					variant='outlined'
					fullWidth
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					sx={{ marginBottom: theme.spacing(2) }}
				/>
				{/* Customer DataGrid */}
				<DataGrid
					rows={filteredCustomerData}
					columns={columns}
					pageSize={5}
					autoPageSize
					sx={{ height: '37rem' }}
				/>
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteConfirmation.open} onClose={closeDeleteConfirmation}>
				<DialogTitle>Delete Customer</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this customer? This customer may have invoices associated with their information and these will be deleted in the process. Please enter the customer's first name as it appears and press delete to confirm.
					</DialogContentText>
					{/* Controlled input field for delete confirmation */}
					<TextField
						label="Enter First Name"
						value={enteredFirstName}
						onChange={handleDeleteConfirm}
						sx={{
							margin: '2rem auto 0 auto'
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteConfirmation}>Cancel</Button>
					<Button
						onClick={() => handleDelete(deleteConfirmation.customerId)}
						color='primary'
						// Disable the Delete button if the entered first name doesn't match
						disabled={enteredFirstName !== deleteConfirmation.expectedFirstName}
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}	