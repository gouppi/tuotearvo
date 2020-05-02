import React from 'react'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import ReviewCardAlt from '../components/Review/ReviewCardAlt';

const featuredPosts = [
    {
      title: 'Sony WF-1000XM3 -Bluetooth-vastamelukuulokkeet, musta',
      date: 'Nov 12',
      description:
        'This is a wider card with supporting text below as a natural lead-in to additional content.',
      image: 'https://media.power-cdn.net/images/h-4746186d318bad3e1eb5c3d7b9c7d267/products/1008619/1008619_5_900x900_w_g.jpg',
      imageText: 'Image Text',
      id:'SonyWF1000XM3'
    },
    {
      title: 'Apple Mac Pro -tietokone, Z0W3',
      date: 'Nov 11',
      description:
        'This is a wider card with supporting text below as a natural lead-in to additional content.',
      image: 'https://cdn.verk.net/images/58/2_597844-996x1176.jpeg',
      imageText: 'Image Text',
      id:'AppleMacPROZ0W3',

    },
    {
        title: 'Apple AirPods ja langaton latauskotelo -nappikuulokkeet, MRXJ2',
        date: 'Nov 11',
        description:
          'This is a wider card with supporting text below as a natural lead-in to additional content.',
        image: 'https://i1.adis.ws/i/dna/Apple_AirPodsWithChargingCase_white_image1?fmt=jpg&bg=rgb(255,255,255)&qlt=100&w=500&h=500',
        imageText: 'Image Text',
        id:'AppleAirPodsMRXJ2'
      },
      {
        title: 'Nikon COOLPIX P1000 -digikamera, musta',
        date: 'Nov 11',
        description:
          'This is a wider card with supporting text below as a natural lead-in to additional content.',
        image: 'https://www.rajalacamera.fi/media/catalog/product/cache/f1ec723725bd5bfc9f8ed8a7baf802be/n/i/nikon_coolpix_p1000_1.jpg',
        imageText: 'Image Text',
        id:'NikonCOOLPIXP1000'
      },
];

export default function Landing() {
    return (
        <Container maxWidth="md">
            
            <Typography style={{paddingTop:'10px',fontWeight:100}} variant="h6">Hei taas! Nämä arvostelut ovat tulleet viimeisimmän käyntisi jälkeen:</Typography>
            <Grid container spacing={4}>
                {featuredPosts.map((post) => (
                    <ReviewCardAlt key={post.title} post={post} />
                ))}
              </Grid>
            <Typography style={{paddingTop:'10px',fontWeight:100}} variant="h6">:</Typography>
            
        </Container>
    );
}