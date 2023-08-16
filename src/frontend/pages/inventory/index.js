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

	// Data Fields
	const columns = [
		{ field: 'id', headerName: 'Battery ID', width: 150 },
		{ field: 'voltage', headerName: 'voltage', width: 150 },
		{ field: 'capacity', headerName: 'capacity', width: 150 },
		{ field: 'price', headerName: 'price', width: 150 },
		{ field: 'quantityOnHand', headerName: 'qtyOnHand', width: 250 },
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
				console.error('Error fetching customer data:', error);
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
			})
			.catch((error) => {
				console.error('Error deleting battery:', error);
			});
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
					Inventory
				</Typography>
				<IconButton>
					<AddCircleIcon sx={{ fontSize: '2.5rem', color: '#000000' }} />
				</IconButton>
			</Box>

			{/* Inventory DataGrid */}
			<div
				style={{
					height: '80%',
					width: '100%',
					marginTop: theme.spacing(2),
					backgroundColor: 'white',
				}}
			>
				<DataGrid rows={inventoryData} columns={columns} pageSize={5} />
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
