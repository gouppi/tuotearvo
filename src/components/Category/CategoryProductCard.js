import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
//import CardActions from '@material-ui/core/CardActions';
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
//import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
//import FormatQuote from '@material-ui/icons/FormatQuote';
//import Container from '@material-ui/core/Container';
import LinkUI from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import CircularProgress from "@material-ui/core/CircularProgress";
import Image from "material-ui-image";
import Paper from "@material-ui/core/paper";
import Box from '@material-ui/core/box';

const useStyles = makeStyles({
  root: {
    //maxWidth: 250,
    padding: "10px",
    //height:'100%'
  },
  quoteContainer: {
    display: "flex",
    alignItems: "center",
  },
});

export default function ImgMediaCard(props, i) {
  const classes = useStyles();
  let product = props.data;
  console.log("CategoryProductCard", product);

  return (
    <Grid key={i} container item xs={12}>
      <LinkUI
        style={{
          textDecoration: "none",
          display: "block",
          height: "100%",
          width: "100%",
        }}
        component={Link}
        to={`/tuotteet/${product.category.seo_name}/${product.id}`}
      >
        <Paper square variant="outlined">
          <Grid container>
            <Grid item xs={3}>
              {/* <Image
                imageStyle={{ objectFit: "contain", height: "90px" }}
                style={{ height: "100px", paddingTop: "0" }}
                src={product.image}
              /> */}
              <Box style={{backgroundImage: `url(${product.image})`}}>

              </Box>
            </Grid>
            <Grid xs={9} item alignItems="top">
              <CardContent>

                  <Typography>{product.name}</Typography>
                  <Rating
                    size="medium"
                    precision={0.1}
                    name="simple-controlled"
                    value={product.rating_avg}
                    label={product.rating_avg}
                    readOnly
                  />


                <br />
                <Typography variant="caption">
                  {product.reviews_count.toString() + " arvostelua"}
                </Typography>
              </CardContent>
            </Grid>
          </Grid>

          {/* <Typography variant="subtitle2" component="p">{new Date(parseInt(props.reviewedAt)).toLocaleString()}</Typography>
              <Typography color="textSecondary" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical' }}>
                {props.text}
              </Typography> */}
        </Paper>
      </LinkUI>
    </Grid>
  );
}
