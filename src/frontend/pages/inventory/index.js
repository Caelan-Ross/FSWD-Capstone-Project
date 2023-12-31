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
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { Snackbar, SnackbarContent } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Home() {
	const theme = useTheme();
	const router = useRouter();
	const handleNavigation = (path) => {
		router.push(path);
	};

	const API_BASE = 'http://localhost:7166/api/Assets';
	const [inventoryData, setInventoryData] = useState([]);
	const [searchQuery, setSearchQuery] = useState([]);

	// State for alerts
	const [showSnackbar, setShowSnackbar] = useState(false);
	const [deleteConfirmation, setDeleteConfirmation] = useState({
		open: false,
		batteryId: null,
	});
	const [showExportSnackbar, setShowExportSnackbar] = useState(false);

	// Data Fields
	const columns = [
		{ field: 'id', headerName: 'Battery ID', width: 100 },
		{ field: 'typeName', headerName: 'Type', width: 100 },
		{ field: 'modelName', headerName: 'Model', width: 100 },
		{ field: 'makeName', headerName: 'Make', width: 100 },
		{ field: 'groupName', headerName: 'Group', width: 100 },
		{
			field: 'conditionName',
			headerName: 'Condition',
			width: 100,
		},
		{ field: 'voltage', headerName: 'Voltage', width: 100 },
		{ field: 'capacity', headerName: 'Capacity', width: 100 },
		{
			field: 'price',
			headerName: 'Price',
			width: 100,
			valueFormatter: (params) => {
				const price = params.value;
				return `$${price.toFixed(2)}`;
			}
		},
		{
			field: 'quantityOnHand',
			headerName: 'Qty on Hand',
			width: 100,
		},
		{
			field: 'stampedSerial',
			headerName: 'Serial',
			width: 100,
		  },
		// {
		// 	field: 'edit',
		// 	headerName: 'Edit',
		// 	width: 50,
		// 	renderCell: (params) => (
		// 		<IconButton onClick={() => handleEdit(params.row.id)}>
		// 			<EditIcon />
		// 		</IconButton>
		// 	),
		// },
		{
			field: 'delete',
			headerName: 'Delete',
			width: 50,
			renderCell: (params) => (
				<IconButton onClick={() => openDeleteConfirmation(params.row.id)}>
					<DeleteIcon />
				</IconButton>
			),
		},
	];

	const openDeleteConfirmation = (assetId) => {
		setDeleteConfirmation({
			open: true,
			assetId: assetId, // Update the property name
		});
	};

	// Function to close the delete confirmation dialog
	const closeDeleteConfirmation = () => {
		setDeleteConfirmation({
			open: false,
			batteryId: null,
		});
	};

	// Function to delete an asset
	const handleDelete = (assetId) => {
		axios
			.delete(`${API_BASE}/${assetId}`)
			.then((response) => {
				console.log('Asset deleted:', response.data);
				// Remove the deleted asset from inventoryData state
				setInventoryData((prevData) =>
					prevData.filter((asset) => asset.id !== assetId)
				);
				closeDeleteConfirmation();
				setShowSnackbar(true);
				setTimeout(() => {
					setShowSnackbar(false);
				}, 2000);
			})
			.catch((error) => {
				console.error('Error deleting asset:', error);
			});
	};

	// // Send user to edit
	// const handleEdit = (batteryId) => {
	// 	router.push(`/inventory/edit?id=${batteryId}`);
	// };

	// Function to export customers
	const handleExport = async () => {
		try {
			await axios.post(`${API_BASE}/Export`);
			setShowExportSnackbar(true);
			setTimeout(() => {
				setShowExportSnackbar(false);
			}, 2000);
		} catch (error) {
			console.error('Error exporting batteries:', error);
		}
	};

	// Filter battery data based on search query
	const filteredInventoryData = inventoryData.filter((battery) => {
		const lowerCaseSearchQuery =
		  typeof searchQuery === 'string' ? searchQuery.toLowerCase() : '';

		return (
		  typeof battery.typeName === 'string' &&
		  (battery.typeName.toLowerCase().includes(lowerCaseSearchQuery) ||
			battery.makeName.toLowerCase().includes(lowerCaseSearchQuery) ||
			battery.stampedSerial.toLowerCase().includes(lowerCaseSearchQuery))
		);
	  });

	// Fetch Inventory Data
	useEffect(() => {
		axios
			.get('http://localhost:7166/api/Assets')
			.then((response) => {
				console.log('API Response:', response.data);
				// Update inventoryData state with fetched data
				setInventoryData(response.data);
			})
			.catch((error) => {
				console.error('Error fetching battery data:', error);
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
				overflow: 'auto',
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
						Inventory
					</Typography>
				</Box>
				<Box>
					{/* Create Battery Icon */}
					<IconButton onClick={() => handleNavigation('/inventory/create')}>
						<AddCircleIcon sx={{ fontSize: '2.5rem', color: '#000000' }} />
					</IconButton>
					{/* Export Batteries Icon */}
					<IconButton onClick={handleExport}>
						<SystemUpdateAltIcon
							sx={{ fontSize: '2.5rem', color: '#000000' }}
						/>
					</IconButton>
				</Box>
			</Box>

			{/* Create Battery message */}
			<Snackbar
				open={showSnackbar}
				autoHideDuration={2000}
				onClose={() => setShowSnackbar(false)}
			>
				<SnackbarContent
					message='Asset deleted successfully'
					action={<CheckCircleOutline />}
				/>
			</Snackbar>
			{/* Export Battery message */}
			<Snackbar
				open={showExportSnackbar}
				autoHideDuration={2000}
				onClose={() => setShowExportSnackbar(false)}
			>
				<SnackbarContent
					message='Batteries exported successfully'
					action={<CheckCircleOutline />}
				/>
			</Snackbar>

			<div
				style={{
					height: '90%',
					marginTop: theme.spacing(2),
					backgroundColor: '#fbfbfbf9',
					borderRadius: '10px',
					padding: '.5rem',
				}}
			>
				{/* Searchbar */}
				<TextField
					type='text'
					label='Search by make or serial'
					variant='outlined'
					fullWidth
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					sx={{ marginBottom: theme.spacing(2) }}
				/>
				{/* Inventory DataGrid */}
				<DataGrid autoPageSize
					rows={filteredInventoryData}
					columns={columns}
					sx={{ height: '37rem' }}
				/>
			</div>

			<Dialog open={deleteConfirmation.open} onClose={closeDeleteConfirmation}>
				<DialogTitle>Delete Asset</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this asset?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteConfirmation}>Cancel</Button>
					<Button
						onClick={() => handleDelete(deleteConfirmation.assetId)}
						color='primary'
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
