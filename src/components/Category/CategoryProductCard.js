import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import LinkUI from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import Image from "material-ui-image";
import Paper from "@material-ui/core/paper";

import './CategoryProductCard.css';

import Skeleton from "@material-ui/lab/Skeleton";
const useStyles = makeStyles({
  root: {
    padding: "10px 0",
  },
  quoteContainer: {
    display: "flex",
    alignItems: "center",
  },
});

export default function CategoryProductCard(props, i) {
  const classes = useStyles();
  let product = props.data;
  let skeleton = props.skeleton ? true : false;

  return (
    <Grid key={i} container className={classes.root} item xs={12}>
      <LinkUI
        className="CardLink"
        component={Link}
        to={skeleton ? '' : `/tuotteet/${product.category.seo_name}/${product.id}`}
      >
        <Paper square variant="outlined">
          <Grid container>
            <Grid item xs={3}>
              {skeleton ? <Skeleton style={{marginLeft:'100px'}} width={100} height={100}/> : (
              <Image
                imageStyle={{ objectFit: "contain", height: "100px" }}
                style={{ height: "100px", paddingTop: "0" }}
                src={product.image}
              />
              )}
            </Grid>
            <Grid xs={9} item>
              <CardContent>
                <Typography>
                  {skeleton ? <Skeleton width={'50%'} /> : product.name}
                </Typography>
                {skeleton ? (
                  <Skeleton width={100} />
                ) : (
                  <Rating
                    size="medium"
                    precision={0.1}
                    name="simple-controlled"
                    value={product.rating_avg}
                    label={product.rating_avg}
                    readOnly
                  />
                )}

                <br />
                <Typography variant="caption">
                  {skeleton ? (
                    <Skeleton width={100} />
                  ) : (
                    product.reviews_count.toString() + " arvostelua"
                  )}
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        </Paper>
      </LinkUI>
    </Grid>
  );
}
