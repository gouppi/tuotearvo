import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ProductInfoApollo from '../components/ProductInfoApollo';
import ProductFilters from '../components/ProductFilters';

const useStyles = makeStyles((theme) => ({
    layout: {
        padding: '10px',
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
          width:'1184px',
          marginLeft: 'auto',
          marginRight: 'auto',
        },
    },
    paper: {
        padding: '20px'
    },
    paperTitle: {
        fontWeight: 200
    },
    rootContainer: {
        marginTop: '10px'
    }
}));

export default function Products() {
    const classes = useStyles();
    return (
      <React.Fragment>
        <CssBaseline />    
        <Container maxWidth="md"  className={classes.rootContainer}>
          <Typography style={{paddingBottom:'1em',paddingTop:'10px',fontWeight:100}} variant="h5">Tuotteet:</Typography>
          
          <Grid container spacing={1}>
            <Grid item md={3}>
              <ProductFilters/>
            </Grid>
            <Grid item container spacing={2} md={9}>
              <ProductInfoApollo/>
              </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    );
}