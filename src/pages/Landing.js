import React from 'react'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import EuroIcon from '@material-ui/icons/Euro';

import ProductsApollo from '../components/ProductsApollo';

export default function Landing() {
    return (
        <Container maxWidth="md">
            
            <Typography style={{paddingBottom:'1em',paddingTop:'10px',fontWeight:100}} variant="h5">Hei taas! Nämä arvostelut ovat ilmestyneet viimeisimmän käyntisi jälkeen:</Typography>
            <Grid style={{paddingBottom:'0.5em'}} container spacing={4}>
              <ProductsApollo/>
            </Grid>
            <Typography style={{paddingBottom:'1em',paddingTop:'50px',fontWeight:100}} variant="h4">Kuinka tämä palvelu toimii?</Typography>
            <Grid container spacing={3}>
                <Grid item xs={6} md={4}>
                    <Paper>
                    <Typography style={{fontWeight:100}} variant="h3" align="center"><EuroIcon style={{fontSize:'100px'}}></EuroIcon></Typography>
                    <Typography style={{fontWeight:100}} variant="h6" align="center">Lorem ipsum dolor sit</Typography>

                    </Paper>
                </Grid>
                <Grid item xs={6} md={4}>
                    <Paper>
                    <Typography style={{fontWeight:100}} variant="h3" align="center"><EuroIcon style={{fontSize:'100px'}}></EuroIcon></Typography>
                    <Typography style={{fontWeight:100}} variant="h6" align="center">Lorem ipsum dolor sit</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6} md={4}>
                    <Paper square>                    
                    <Typography style={{fontWeight:100}} variant="h3" align="center"><EuroIcon style={{fontSize:'100px'}}></EuroIcon></Typography>
                    <Typography style={{fontWeight:100}} variant="h6" align="center">Lorem ipsum dolor sit</Typography>

                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}