import React, {useEffect} from 'react'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';

import RecentReviews from '../components/Apollo/RecentReviews';

export default function Landing() {

    useEffect(() => {
        document.title = 'Tuotearvostelut'
    });

    return (
        <Container maxWidth="xl">
            <Typography style={{paddingBottom:'1em',fontWeight:100}} variant="h5">Uusimmat tuotearvostelut</Typography>
            <Grid container spacing={3}>
                <RecentReviews/>
            </Grid>
        </Container>
    );
}