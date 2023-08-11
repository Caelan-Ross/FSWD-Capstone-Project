import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Drawer from '@mui/material/Drawer';
import { Box, Button } from '@mui/material';
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
                {icons.map((item, index) => (
                    <IconButton key={index} onClick={() => router.push(item.path)} sx={{ margin: '0 auto 10px auto' }}>
                        {item.icon}
                    </IconButton>
                ))}
            </Box>

            <Drawer anchor="left" open={open} onClose={toggleDrawer}>

                <List>
                    <Button onClick={closeDrawer} sx={{ width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', margin: '5px 0px', fontSize: '1rem', paddingRight: '2rem', color: 'red'}}>
                        <CloseIcon sx={{fontSize: '2rem'}}/>
                        Close
                    </Button>
                    {icons.map((item, index) => (
                        <div key={index} onClick={() => { router.push(item.path); closeDrawer(); }}>
                            <ListItem button>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                {open && <ListItemText primary={item.text} />}
                            </ListItem>
                        </div>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
};

export default Navbar;