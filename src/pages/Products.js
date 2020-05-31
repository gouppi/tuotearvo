import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ProductInfoApollo from '../components/ProductInfoApollo';
import ProductFilters from '../components/ProductFilters';
import Card from '@material-ui/core/Card';

import RecentReviews from '../components/Apollo/RecentReviews';


const useStyles = makeStyles((theme) => ({
  layout: {
    padding: '10px',
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: '1184px',
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

}));

export default function Products() {
  const classes = useStyles();
  useEffect(() => {
    document.title = 'Tuotearvostelut - Tuotteet'
  });
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl" className={classes.rootContainer}>
        <Typography style={{ paddingBottom: '1em', paddingTop: '10px', fontWeight: 100 }} variant="h5">Tuotteet</Typography>

        <Grid container spacing={3}>
          <Grid item md={3}>
            <Card>
              <ProductFilters />
            </Card>
          </Grid>
          <Grid item container md={9} spacing={1}>
              <RecentReviews/>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}