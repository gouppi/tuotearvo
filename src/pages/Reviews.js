import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import ReviewCard from '../components/ReviewCard';
import ReviewCardAlt from '../components/ReviewCardAlt';
import Navigation from '../components/Navigation';
import Typography from '@material-ui/core/Typography';

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

const featuredPosts = [
    {
      title: 'Sony WF-1000XM3 -Bluetooth-vastamelukuulokkeet, musta',
      date: 'Nov 12',
      description:
        'This is a wider card with supporting text below as a natural lead-in to additional content.',
      image: 'https://source.unsplash.com/random',
      imageText: 'Image Text',
    },
    {
      title: 'Apple Mac Pro -tietokone, Z0W3',
      date: 'Nov 11',
      description:
        'This is a wider card with supporting text below as a natural lead-in to additional content.',
      image: 'https://cdn.verk.net/images/58/2_597844-996x1176.jpeg',
      imageText: 'Image Text',
    },
    {
        title: 'Apple AirPods ja langaton latauskotelo -nappikuulokkeet, MRXJ2',
        date: 'Nov 11',
        description:
          'This is a wider card with supporting text below as a natural lead-in to additional content.',
        image: 'https://source.unsplash.com/random',
        imageText: 'Image Text',
      },
      {
        title: 'Nikon COOLPIX P1000 -digikamera, musta',
        date: 'Nov 11',
        description:
          'This is a wider card with supporting text below as a natural lead-in to additional content.',
        image: 'https://source.unsplash.com/random',
        imageText: 'Image Text',
      },
          {
        title: 'WhiteWash WM3216/WH pyykinpesukone, valkoinen',
        date: 'Nov 11',
        description:
          'This is a wider card with supporting text below as a natural lead-in to additional content.',
        image: 'https://source.unsplash.com/random',
        imageText: 'Image Text',
      },
  ];


export default function Reviews() {
    const classes = useStyles();

    return (
        <React.Fragment>
          <CssBaseline />
          <Navigation></Navigation>

          <Container maxWidth="lg"  className={classes.rootContainer}>
                <main>
                <Typography variant="h6" color="textPrimary">
  Viimeisimmät arvostelut
</Typography>
              <Grid container spacing={3}>
                {featuredPosts.map((post) => (
                  <ReviewCardAlt key={post.title} post={post} />
                ))}
              </Grid>
              
            </main>
          </Container>
          
        </React.Fragment>
    );
}