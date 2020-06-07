import React from "react";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import LinkUI from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import Image from "material-ui-image";
import Paper from "@material-ui/core/paper";

export default function ReviewCard(props, i) {
  const { rating, text, title, product, reviewedAt } = props.data;

  return (
    <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
      <LinkUI
        style={{ textDecoration: "none", display: "block", height: "100%" }}
        component={Link}
        to={`/tuotteet/${product.category.seo_name}/${product.id}`}
      >
        <Paper square variant="outlined" style={{ height: "100%" }}>
          <Image
            imageStyle={{ objectFit: "contain", height: "150px" }}
            style={{ height: "150px", paddingTop: "0" }}
            src={product.image}
          />
          <CardContent>
            <Typography>{product.group_name}</Typography>
            <Typography variant="caption">{title}</Typography>

            <Rating
              size="small"
              precision={0.1}
              name="simple-controlled"
              value={rating}
              label={rating}
              readOnly
            />
            <Typography variant="subtitle2" component="p">
              {new Date(parseInt(reviewedAt)).toLocaleString()}
            </Typography>
            <Typography
              color="textSecondary"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
            >
              {text}
            </Typography>
          </CardContent>
        </Paper>
      </LinkUI>
    </Grid>
  );
}
