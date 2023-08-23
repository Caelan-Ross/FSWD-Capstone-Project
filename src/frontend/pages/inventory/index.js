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

export default function Home() {
	const theme = useTheme();
	const router = useRouter();
	const handleNavigation = (path) => {
		router.push(path);
	};

	const API_BASE = 'http://localhost:7166/api/Batteries';
	const [inventoryData, setInventoryData] = useState([]);
	const [deleteConfirmation, setDeleteConfirmation] = useState({
		open: false,
		batteryId: null,
	});
	const [showSnackbar, setShowSnackbar] = useState(false);
	const [showExportSnackbar, setShowExportSnackbar] = useState(false);

	// Data Fields
	const columns = [
		{ field: 'id', headerName: <strong>Battery ID</strong>, width: 100 },
		{ field: 'typeName', headerName: <strong>Type</strong>, width: 150 },
		{ field: 'modelName', headerName: <strong>Model</strong>, width: 100 },
		{ field: 'makeName', headerName: <strong>Make</strong>, width: 100 },
		{ field: 'voltage', headerName: <strong>Voltage</strong>, width: 100 },
		{ field: 'capacity', headerName: <strong>Capacity</strong>, width: 100 },
		{ field: 'price', headerName: <strong>Price</strong>, width: 100 },
		{
			field: 'quantityOnHand',
			headerName: <strong>Qty on Hand</strong>,
			width: 100,
		},
		{ field: 'groupName', headerName: <strong>Group</strong>, width: 100 },
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

	// Fetch Inventory Data
	useEffect(() => {
		axios
			.get(API_BASE, {
				headers: {
					accept: 'text/plain',
				},
			})
			.then((response) => {
				console.log(response);
				// Update inventoryData state with fetched data
				setInventoryData(response.data);
			})
			.catch((error) => {
				console.error('Error fetching battery data:', error);
			});
	}, []);

	// Function to open the delete confirmation dialog
	const openDeleteConfirmation = (batteryId) => {
		setDeleteConfirmation({
			open: true,
			batteryId: batteryId,
		});
	};

	// Function to close the delete confirmation dialog
	const closeDeleteConfirmation = () => {
		setDeleteConfirmation({
			open: false,
			batteryId: null,
		});
	};

	// Function to delete a battery
	const handleDelete = (batteryId) => {
		axios
			.delete(`${API_BASE}/${batteryId}`)
			.then((response) => {
				console.log('Battery deleted:', response.data);
				// Remove the deleted battery from inventoryData state
				setInventoryData((prevData) =>
					prevData.filter((battery) => battery.id !== batteryId)
				);
				closeDeleteConfirmation();
				setShowSnackbar(true);
				setTimeout(() => {
					setShowSnackbar(false);
				}, 2000);
			})
			.catch((error) => {
				console.error('Error deleting battery:', error);
			});
	};

	// Send user to edit
	const handleEdit = (batteryId) => {
		router.push(`/inventory/edit?id=${batteryId}`);
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
			console.error('Error exporting batteries:', error);
		}
	};

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
					message='Battery deleted successfully'
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

			{/* Inventory DataGrid */}
			<div
				style={{
					height: '90%',
					marginTop: theme.spacing(2),
					backgroundColor: '#fbfbfbf9',
					borderRadius: '10px',
					padding: '.5rem',
				}}
			>
				<DataGrid
					rows={inventoryData}
					columns={columns}
					pageSize={5}
					sx={{ alignItems: 'center', margin: 'auto' }}
				/>
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteConfirmation.open} onClose={closeDeleteConfirmation}>
				<DialogTitle>Delete Battery</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this battery?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteConfirmation}>Cancel</Button>
					<Button
						onClick={() => handleDelete(deleteConfirmation.batteryId)}
						color='primary'
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
