import React from "react";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import LinkUI from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import Paper from "@material-ui/core/paper";

import Skeleton from '@material-ui/lab/Skeleton';

export default function SearchResultCard(props) {

  const {reloading} = props;

  return (
    <Grid key={props.i} container item xs={12}>
      <LinkUI
        style={{
          textDecoration: "none",
          display: "block",
          width: "100%",
          height: "100%",
          paddingTop:'8px'
        }}
        component={Link}
        to={`/tuotteet/${props.data.category.seo_name}/${props.data.id}`}
      >
        <Paper square variant="outlined">
          <Grid container>
            <Grid item xs={3} style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
              {reloading &&
                <Skeleton width="75%" height="100%" wave/>
              }
              {! reloading && <CardMedia style={{width:"75%",height:"75%",backgroundSize:"contain"}} image={props.data.image} title="Paella dish" /> }

            </Grid>
            <Grid xs={9} item>
              <CardContent>
                {reloading && (
                  <>
                  <Skeleton width={120} height={24} wave/>
                  <Skeleton height={24} wave/>
                  <Skeleton height={16} width={50} wave />
                  </>
                )}

                {!reloading && (
                  <>
                  <Rating
                  size="medium"
                  precision={0.1}
                  name="simple-controlled"
                  value={
                    props.data.rating_avg
                      ? props.data.rating_avg
                      : props.data.family_rating_avg
                  }
                  label={
                    props.data.rating_avg
                      ? props.data.rating_avg
                      : props.data.family_rating_avg
                  }
                  readOnly
                />
                <Typography component="p">{props.data.name}</Typography>
                <Typography variant="caption">
                  {props.data.reviews_count +
                    " (" +
                    props.data.family_reviews_count +
                    ") arvostelua"}
                </Typography>
                </>
                )}






              </CardContent>
            </Grid>
          </Grid>
        </Paper>
      </LinkUI>
    </Grid>
  );
}
