import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const closeDrawer = () => {
        setOpen(false);
    };

    const icons = [
        { icon: <HomeIcon sx={{ fontSize: '2rem' }} />, text: 'Home', path: '/' },
        { icon: <ReceiptIcon sx={{ fontSize: '2rem' }} />, text: 'Invoices', path: '/invoices' },
        { icon: <InventoryIcon sx={{ fontSize: '2rem' }} />, text: 'Inventory', path: '/inventory' },
        { icon: <GroupAddIcon sx={{ fontSize: '2rem' }} />, text: 'Customers', path: '/customer' },
        { icon: <LogoutIcon sx={{ color: 'red', fontSize: '2rem' }} />, text: 'Logout', path: '/' },
        { icon: <SettingsIcon sx={{ fontSize: '2rem' }} />, text: 'Settings', path: '/settings' },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', borderRight: '1px solid #c1c1c1', height: '100%' }}>
                <IconButton onClick={toggleDrawer} sx={{ margin: '10px auto' }}>
                    {open ? <CloseIcon /> : <MenuIcon sx={{ fontSize: '2rem' }} />}
                </IconButton>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    {icons.slice(0, 4).map((item, index) => (
                        <IconButton key={index} onClick={() => router.push(item.path)} sx={{ margin: '0 auto 10px auto' }}>
                            {item.icon}
                        </IconButton>
                    ))}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                    {icons.slice(4).map((item, index) => (
                        <IconButton key={index} onClick={() => router.push(item.path)} sx={{ margin: '0 auto 10px auto' }}>
                            {item.icon}
                        </IconButton>
                    ))}
                </Box>
            </Box>

            <Drawer anchor="left" open={open} onClose={toggleDrawer}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%', justifyContent: 'space-between' }}>
                    <Box>
                        <List><ListItem button onClick={closeDrawer}>
                            <ListItemIcon><CloseIcon sx={{ fontSize: '2rem', color: 'red' }} /></ListItemIcon>
                            <ListItemText sx={{ color: 'red' }}>Close</ListItemText>
                        </ListItem>
                            {icons.map((item, index) => (
                                <Box key={index} onClick={() => { router.push(item.path); closeDrawer(); }}>
                                    <ListItem button>
                                        <ListItemIcon>{((index <= 3 && item.icon))}</ListItemIcon>
                                        {open && ((index <= 3 && item.text)) && <ListItemText primary={item.text} />}
                                    </ListItem>
                                </Box>
                            ))}</List>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <List>{icons.map((item, index) => (
                            <Box key={index} onClick={() => { router.push(item.path); closeDrawer(); }}>
                                <ListItem button>
                                    <ListItemIcon>{((index >= 4 && item.icon))}</ListItemIcon>
                                    {open && (index >= 4 && item.text) && <ListItemText primary={item.text} />}
                                </ListItem>
                            </Box>
                        ))}</List>
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
};

export default Navbar;