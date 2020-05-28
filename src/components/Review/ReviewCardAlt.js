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
import Rating from '@material-ui/lab/Rating';


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

export default function ImgMediaCard(props,i) {

  function truncate(str, n){
    return (str.length > n) ? str.substr(0, n-1) + '...' : str;
  };

  const classes = useStyles();
  const { rating,text,title,product,reviewedAt } = props.data;




  return (
    <Grid key={i} item xs={6} md={3}>
        <LinkUI style={{textDecoration:'none'}} component={Link} to={`/product/${product.id}/stores`}>
        <Card className={classes.root}>
        <CardActionArea>
            <CardMedia
            component="img"
            alt="Contemplative Reptile"
            height="140"
            image={product.image ? product.image : 'https://i.picsum.photos/id/400/200/300.jpg'}
            title="Contemplative Reptile"
            />
            <CardContent>
            <Typography style={{fontWeight:100,fontSize:'1rem',overflow:'hidden', display:'-webkit-box', 'WebkitBoxOrient':'vertical', 'WebkitLineClamp':'2', textOverflow:'ellipsis' }} gutterBottom variant="h6">
                {product.group_name}
            </Typography>
            <Rating
              size="small"
              precision={0.1}
              name="simple-controlled"
              value={rating}
              label={rating}
              readOnly
              />
                <Typography variant="subtitle2" component="p">{reviewedAt}</Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {truncate(text, 70)}
                </Typography>

            </CardContent>
        </CardActionArea>
        </Card>
        </LinkUI>
    </Grid>
  );

}