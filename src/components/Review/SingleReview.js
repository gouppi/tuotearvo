import React from "react";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import Paper from "@material-ui/core/Paper";
import LinkUI from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import CardMedia from "@material-ui/core/CardMedia";
import Box from '@material-ui/core/Box';

const imgLink =
  "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260";

export default function SingleReview(props) {
  const review = { ...props };
  let localeDate = new Date(parseInt(review.date));
  localeDate = localeDate.toLocaleString("fi-FI");
  return (
    <Paper square variant="outlined">
      {props.product && (
        <Box style={{
          display:"flex",
          alignItems:"center",
          padding:"4px",
          paddingLeft:"10px",
          backgroundColor:"#edf1f7",
          borderBottom: "1px solid ",
          marginBottom:"10px"
        }}>

          <Typography variant="caption">
            Tämä arvostelu on kirjoitettu tuotteesta
            <LinkUI
              component={Link}
              to={
                "/tuotteet/" +
                props.product.category.seo_name +
                "/" +
                props.product.id
              }
            >
              {" "}
              {props.product.name}
            </LinkUI>

          </Typography>

          <CardMedia
            component="img"
            alt="Contemplative Reptile"
            style={{ marginLeft:"10px",maxWidth: "24px" }}
            width="auto"
            image={props.product.image}
            title="Contemplative Reptile"
          />
        </Box>
      )}
      <Grid style={{ padding: "4px" }} container wrap="nowrap" spacing={0}>
        <Grid item xs={1}>
          <Avatar alt="Lorem Ipsum" src={imgLink} />
        </Grid>
        <Grid container item xs={11}>
          <Grid item container xs={6}>
            <Grid item xs={12}>
              <Typography
                style={{ fontStyle: "italic" }}
                variant="caption"
                display="block"
                gutterBottom
              >
                {review.date ? localeDate : "lisätty 15 minuuttia sitten"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Rating
                size="small"
                precision={0.1}
                name="simple-controlled"
                value={review.score}
                label={review.score}
                readOnly
              />
            </Grid>
          </Grid>
          <Grid container justify="flex-end" item xs={6}>
            <Typography
              style={{ fontStyle: "italic" }}
              variant="caption"
              display="block"
              gutterBottom
            >
              Arvostelun lähde: {review.shop.name}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography>{review.text ? review.text : ""}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
