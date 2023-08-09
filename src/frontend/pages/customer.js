import React from 'react';
import { Typography, Box, useTheme, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function Home() {
	const theme = useTheme();

	// Dummy customer data
	const customerData = [
		{
			id: 1,
			firstName: 'John',
			lastName: 'Doe',
			phone: '123-456-7890',
			email: 'john@example.com',
		},
		{
			id: 2,
			firstName: 'Jane',
			lastName: 'Smith',
			phone: '987-654-3210',
			email: 'jane@example.com',
		},
		{
			id: 3,
			firstName: 'Jane',
			lastName: 'Smith',
			phone: '987-654-3210',
			email: 'jane@example.com',
		},
		// Add more dummy data rows here
	];

	const columns = [
		{ field: 'id', headerName: 'Customer ID', width: 150 },
		{ field: 'firstName', headerName: 'First Name', width: 150 },
		{ field: 'lastName', headerName: 'Last Name', width: 150 },
		{ field: 'phone', headerName: 'Phone No.', width: 150 },
		{ field: 'email', headerName: 'Email', width: 250 },
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
				margin: '30px',
				padding: '30px',
				height: '92.5%',
				py: 4,
				overflow: 'auto',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-start',
					width: '100%',
				}}
			>
				<Typography variant='h3' align='center' component='h2'>
					Customer
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
		</Box>
	);
}
