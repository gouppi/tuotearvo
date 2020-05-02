import React from 'react'
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';

import EuroIcon from '@material-ui/icons/Euro';

import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import Container from '@material-ui/core/Container';

export default function ProductStores() {

    let stores = [
        {
            img: "https://www.power.fi/images/favicon/powerfi/mstile-310x310.png",
            price: '123,23'
        },
        {
            img: "https://pbs.twimg.com/profile_images/1145562519039283200/pfRACtCr_400x400.png",
            price: '143,21'
        },

    ]

    return (
        <Grid container spacing={2}>
            {stores.map((store) => (
            <Grid item xs={6}>
                <Paper>
                <Container style={{display:'flex',alignItems:'center',margin:'5px',padding:'5px'}} square>
                    
                    <Avatar variant="square" style={{width:'24px', height:'24px', paddingRight:'5px'}} alt="Kauppa" src={store.img}/>
                    <Typography variant="h5">{store.price}</Typography>
                    <EuroIcon style={{paddingLeft:'5px'}}/>
                    
                    
                </Container>
                <Typography style={{fontStyle:'italic'}} variant="caption" display="block" gutterBottom>
              
                </Typography>
                </Paper>
            </Grid>
            ))} 
        </Grid>
       )
            
}