import React from 'react'
import Paper from '@material-ui/core/Paper';
import EuroIcon from '@material-ui/icons/Euro';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
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
                <Container style={{display:'flex',alignItems:'center',margin:'5px',padding:'5px'}} square={true}>
                    
                    <Avatar variant="square" style={{width:'24px', height:'24px', paddingRight:'5px'}} alt="Kauppa" src={store.img}/>
                    <Typography variant="h5">{store.price}</Typography>
                    <EuroIcon style={{paddingLeft:'5px'}}/>
                    
                    
                </Container>
                <Typography style={{fontStyle:'italic'}} variant="caption" display="block" gutterBottom>
              
                </Typography>
                </Paper>
            </Grid>
            ))}
            <Grid item xs={12}>
                <Typography style={{fontStyle:'italic'}} variant="caption" display="block" gutterBottom>
                    Katso loput [NUM] kauppaa tästä
                </Typography>
            </Grid>
        </Grid>
       )
            
}