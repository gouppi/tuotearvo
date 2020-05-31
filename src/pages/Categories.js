import React, { useEffect } from 'react'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';

import RecentReviews from '../components/Apollo/RecentReviews';
import CategoryProducts from '../components/Apollo/CategoryProducts';

import { useParams } from 'react-router-dom';

export default function Categories() {

    let { category } = useParams();
    console.log("Kategoria seo nimi: ", category);


    useEffect(() => {
        document.title = 'Tuotearvostelut - Kategoriat'
    });



    return (
        <Container maxWidth="xl">
            <Typography style={{ paddingBottom: '1em', paddingTop: '10px', fontWeight: 100 }} variant="h5"> {"Kategoriat " + (category ? category : 'pohjasivu')}</Typography>
            <Grid container spacing={3}>
                <CategoryProducts categoryName={category} />
            </Grid>
        </Container>
    );
}