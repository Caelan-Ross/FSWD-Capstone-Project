import '@/styles/globals.css';
import {
	CssBaseline,
	Box,
	Button,
	Typography,
	IconButton,
	Menu,
	MenuItem,
	Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function App({ Component, pageProps }) {
	const [menuAnchor, setMenuAnchor] = useState(null);
	const router = useRouter();
	const user = 'John Doe'; // Replace with the actual user name

	const handleNavigation = (path) => {
		router.push(path);
	};

	const handleMenuOpen = (event) => {
		setMenuAnchor(event.currentTarget);
	};

	const handleMenuClose = () => {
		setMenuAnchor(null);
	};

	return (
		<CssBaseline>
			{/* Main container */}
			<Box
				sx={{
					color: 'black',
					display: 'flex',
					flexDirection: 'row',
					maxHeight: '100vh',
					maxWidth: '100vw',
				}}
			>
				{/* Sidebar Column */}
				<Box
					sx={{
						flex: '0 0 auto',
						backgroundColor: '#ffffff', // Light background color
						width: '100px', // Adjust this to control the width of the sidebar
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'space-between', // Distributes items evenly along the vertical axis
					}}
				>
					<IconButton
						onClick={handleMenuOpen}
						sx={{ marginBottom: '20px', marginTop: '10px' }}
					>
						<MenuIcon />
					</IconButton>
					<Box
						sx={{
							flexGrow: 1,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
						}}
					>
						<Button
							onClick={() => handleNavigation('/')}
							sx={{ marginBottom: '10px' }}
						>
							Home
						</Button>
						<Button
							onClick={() => handleNavigation('/')}
							sx={{ marginBottom: '10px' }}
						>
							Inventory
						</Button>
						<Button
							onClick={() => handleNavigation('/')}
							sx={{ marginBottom: '10px' }}
						>
							Invoices
						</Button>
						<Button
							onClick={() => handleNavigation('/')}
							sx={{ marginBottom: '10px' }}
						>
							Customer
						</Button>
						<Button
							onClick={() => handleNavigation('/')}
							sx={{ marginBottom: '10px' }}
						>
							Logout
						</Button>
					</Box>
				</Box>
				{/* Content Column*/}
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						padding: '0px 50px',
					}}
				>
					{/* Header Row */}
					<Box
						sx={{
							flex: '0 0 auto',
							backgroundColor: '#ffffff', // Light background color
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							padding: '10px',
						}}
					>
						{/* User greeting */}
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								flexGrow: 1,
							}}
						>
							<Avatar src='/path/to/avatar-image.jpg' alt='User Avatar' />
							<Box sx={{ marginLeft: '10px' }}>
								<Typography variant='body1'>
									The Battery Doctor - Welcome '{user}'!
								</Typography>
								<Typography variant='caption' color='textSecondary'>
									2023-08-04
								</Typography>
							</Box>
						</Box>
						{/* New Invoice Button */}
						<Box>
							<Button
								onClick={() => handleNavigation('/new-invoice')}
								startIcon={<AddIcon />}
								sx={{
									backgroundColor: '#3f51b5',
									color: '#ffffff',
								}}
							>
								New Invoice
							</Button>
						</Box>
					</Box>
					{/* Page Swap in Section */}
					<Box
						sx={{
							backgroundColor: '#f4f4f4',
							flex: '1',
							overflow: 'auto',
							margin: '50px 0px',
							padding: '20px',
						}}
					>
						<Component {...pageProps} />
					</Box>

				</Box>
			</Box>
		</CssBaseline>
	);
}
