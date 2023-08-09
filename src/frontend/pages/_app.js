import '@/styles/globals.css';
import {
	CssBaseline,
	Box,
	Button,
	Typography,
	IconButton,
	Avatar,
	Drawer,
	List,
	ListItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function App({ Component, pageProps }) {
	const router = useRouter();
	const handleNavigation = (path) => {
		router.push(path);
	};

	const [open, setOpen] = useState(false);

	const handleToggle = () => {
		setOpen(!open);
	};


	// Username greeted in banner
	const user = 'John Doe';

	return (
		<CssBaseline>
			{/* Main container */}
			<Box
				sx={{
					color: 'black',
					display: 'flex',
					flexDirection: 'row',
					maxHeight: '100vh',
				}}
			>
				{/* Sidebar Column */}
				<Box
					sx={{
						width: open ? '12%' : '2%',
						transition: 'width 0.3s',
						backgroundColor: '#f4f4f4',
					}}
				>
					<Drawer
						variant='persistent'
						open={true}
						sx={{
							flex: '0 0 auto',
							backgroundColor: '#f4f4f4',
							minHeight: '100vh',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							textAlign: 'center',
							justifyContent: 'space-between',
							zIndex: '999',
							overflowX: 'hidden',
							width: '100%',
						}}
					>
						<IconButton
							onClick={handleToggle}
							sx={{
								marginBottom: '40px',
								marginTop: '10px',
							}}
						>
							<MenuIcon sx={{ fontSize: '3.125rem', color: '#000000' }} />
						</IconButton>
						<Box
							sx={{
								flexGrow: 1,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'flex-start',
							}}
						>
							<IconButton
								onClick={() => handleNavigation('/')}
								sx={{ marginBottom: '10px' }}
							>
								<HomeIcon sx={{ fontSize: '3.125rem', color: '#000000' }} />
							</IconButton>
							<IconButton
								onClick={() => handleNavigation('/inventory')}
								sx={{ marginBottom: '10px' }}
							>
								<InventoryIcon sx={{ fontSize: '3.125rem', color: '#000000' }} />
							</IconButton>
							<IconButton
								onClick={() => handleNavigation('/invoices')}
								sx={{ marginBottom: '10px' }}
							>
								<ReceiptIcon sx={{ fontSize: '3.125rem', color: '#000000' }} />
							</IconButton>

							<IconButton
								onClick={() => handleNavigation('/customer')}
								sx={{ marginBottom: '10px' }}
							>
								<GroupAddIcon sx={{ fontSize: '3rem', color: '#000000' }} />
							</IconButton>
						</Box>
						<IconButton
							onClick={() => handleNavigation('/settings')}
							sx={{ marginBottom: '10px' }}
						>
							<ErrorIcon sx={{ fontSize: '3.125rem', color: 'red' }} />
						</IconButton>
						<IconButton
							onClick={() => handleNavigation('/settings')}
							sx={{ marginBottom: '10px' }}
						>
							<SettingsIcon sx={{ fontSize: '3.125rem', color: '#000000' }} />
						</IconButton>
					</Drawer>
				</Box>
				{/* Content Column*/}
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						padding: '0px 20px',
						width: '100vw',
						margin: '0 auto',
					}}
				>
					{/* Header Row Container */}
					<Box
						sx={{
							flex: '0 0 auto',
							backgroundColor: '#ffffff',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							height: '6rem',
							width: '99%',
							margin: '0 0 0 1.25rem',
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
							<Box sx={{ marginLeft: '0.625rem' }}>
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
								onClick={() => handleNavigation('/')}
								startIcon={<AddIcon />}
								className='btn-primary'
								sx={{
									color: '#ffffff',
									padding: '15px',
									borderRadius: '8px',
								}}
							>
								New Invoice
							</Button>
						</Box>
					</Box>
					{/* Page Swap in Section */}
					<Box
						sx={{
							backgroundColor: '#959595',
							outline: '1px solid #E6E8E7',
							borderRadius: '8px',
							flex: '1',
							overflow: 'auto',
							margin: '.25rem 0 1.25rem 1.25rem',
							maxHeight: 'calc(100vh - 6rem - 2.5rem)',
							width: '99%',
						}}
					>
						<Component {...pageProps} />
					</Box>
				</Box>
			</Box>
		</CssBaseline>
	);
}
