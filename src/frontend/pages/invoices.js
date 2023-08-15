import React, { useState, useEffect } from 'react';
import { Typography, Box, useTheme, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Invoices() {
	const theme = useTheme();
	const router = useRouter();
	const handleNavigation = (path) => {
		router.push(path);
	};

	// Dummy invoice data
	const invoiceData = [
		{
			id: 100000,
			invoiceDate: '01/01/2000',
			customerName: 'Doe',
			batteryAmt: 10,
			saleAmount: '$100.00',
		},
		{
			id: 100001,
			invoiceDate: '02/02/2000',
			customerName: 'John Smith',
			batteryAmt: 2,
			saleAmt: '$30.00',
		},
		// Add more dummy data rows here
	];

	const columns = [
		{ field: 'id', headerName: 'Invoice No.', width: 150 },
		{ field: 'invoiceDate', headerName: 'Date', width: 150 },
		{ field: 'customerName', headerName: 'Name', width: 150 },
		{ field: 'batteryAmt', headerName: '# Of Batteries', width: 150 },
		{ field: 'saleAmount', headerName: 'Sale Amount', width: 250 },
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
				<IconButton>
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
