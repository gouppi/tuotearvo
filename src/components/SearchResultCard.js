import React from "react";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import LinkUI from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import Image from "material-ui-image";
import Paper from "@material-ui/core/paper";

export default function SearchResultCard(props, i) {
  return (
    <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
      <LinkUI
        style={{ textDecoration: "none", display: "block", height: "100%" }}
        component={Link}
        to={`/tuotteet/${props.data.category.seo_name}/${props.data.id}`}
      >
        <Paper square variant="outlined" style={{ height: "100%" }}>
          <Image
            imageStyle={{ objectFit: "contain", height: "150px" }}
            style={{ height: "150px", paddingTop: "0" }}
            src={props.data.image}
          />
          <CardContent>
            <Rating
              size="small"
              precision={0.1}
              name="simple-controlled"
              value={props.data.rating_avg}
              label={props.data.rating_avg}
              readOnly
            />
            <Typography>{props.data.group_name}</Typography>
            <Typography variant="caption">{props.data.name}</Typography>
            <br />

            <br />
            <Typography variant="caption">
              {props.data.reviews_count + " arvostelua"}
            </Typography>
          </CardContent>
        </Paper>
      </LinkUI>
    </Grid>
  );
}
