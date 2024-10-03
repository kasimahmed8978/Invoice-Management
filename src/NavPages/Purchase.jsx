import React from 'react';
import NavBar from '../NavBar';
import Box from '@mui/material/Box';

function Purchase(props) {
    return (
        <div>
        <Box sx={{display:'flex',p:10}}>
            <NavBar/>
            <Box component='main' sx={{flexGrow:1}}>
            <h1>Purchase</h1>
            </Box>
        </Box>
        </div>
    );
}

export default Purchase;