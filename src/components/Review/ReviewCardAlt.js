import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
//import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
//import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
//import FormatQuote from '@material-ui/icons/FormatQuote';
//import Container from '@material-ui/core/Container';
import LinkUI from '@material-ui/core/Link';
import {Link} from 'react-router-dom';
const useStyles = makeStyles({
  root: {
    //maxWidth: 250,
    height:'100%'
  },
  quoteContainer: {
      display:'flex',
      alignItems:'center'
  }
});

export default function ImgMediaCard(props) {
  const classes = useStyles();
  const { id,name,image } = props.data;
 // console.log("Id: ", id, "Name: ", name, "Image: ", image);

  return (
    <Grid item xs={6} md={3}>
        <LinkUI style={{textDecoration:'none'}} component={Link} to={`/product/${id}/stores`}>
        <Card className={classes.root}>
        <CardActionArea>
            <CardMedia
            component="img"
            alt="Contemplative Reptile"
            height="140"
            image={image}
            title="Contemplative Reptile"
            />
            <CardContent>
            <Typography style={{fontWeight:100,fontSize:'1rem',overflow:'hidden', display:'-webkit-box', 'WebkitBoxOrient':'vertical', 'WebkitLineClamp':'2', textOverflow:'ellipsis' }} gutterBottom variant="h6">
                {name}
            </Typography>
                <Typography variant="subtitle2" component="p">30.4.2020 klo 20:33:14</Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                </Typography>
            </CardContent>
        </CardActionArea>
        </Card>
        </LinkUI>
    </Grid>
  );

}