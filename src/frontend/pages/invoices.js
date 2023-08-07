import React from 'react';
import { Typography, Box, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function Home() {
	const theme = useTheme();
	// Dummy customer data
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
	];

	return (
		<Box
			display='flex'
			flexDirection='column'
			alignItems='center'
			sx={{
				backgroundColor: 'white',
				margin: '30px',
				padding: '30px',
				minHeight: '100vh',
				py: 4,
			}}
		>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					width: '100%',
				}}
			>
				<Typography variant='h3' align='center' component='h2'>
					Invoices
				</Typography>
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
			<div style={{ height: 400, width: '100%', marginTop: theme.spacing(2) }}>
				<DataGrid rows={invoiceData} columns={columns} pageSize={5} />
			</div>
		</Box>
	);
}
