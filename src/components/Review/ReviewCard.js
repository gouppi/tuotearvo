import React from "react";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import LinkUI from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import Image from "material-ui-image";
import Paper from "@material-ui/core/paper";
import FormatQuoteIcon from "@material-ui/icons/FormatQuote";
import Box from "@material-ui/core/Box";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";



const { DateTime } = require("luxon");

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    backgroundSize: "contain",
    paddingTop: "50%", // 16:9
  },
}));

export default function ReviewCard(props, i) {
  const { rating, text, product, reviewedAt, origin } = props.data;
  const classes = useStyles();
  var newFormat = {
    day: "numeric",
    month: "long",
    minute: "numeric",
    hour: "numeric",
  };

  return (
    <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
      <LinkUI
        style={{ textDecoration: "none", display: "block", height: "100%" }}
        component={Link}
        to={`/tuotteet/${product.category.seo_name}/${product.id}`}
      >
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar
                src="https://scontent-hel2-1.xx.fbcdn.net/v/t1.0-9/83911372_10156913626997671_6202868584373288960_o.png?_nc_cat=105&_nc_sid=85a577&_nc_oc=AQmNYHkhmlAgYFagYHKHSL3xBC0rXTRWGeVBaOAaxAAAEnh-xaghqlbEx6CN5OyQuzg&_nc_ht=scontent-hel2-1.xx&oh=0989160a2e324dd962ecdc928bd39b44&oe=5F075AE9"
                aria-label={origin}
              ></Avatar>
            }
            // action={
            //   <IconButton aria-label="settings">
            //     <MoreVertIcon />
            //   </IconButton>
            // }
            title={product.name}
            titleTypographyProps={{
              "aria-label":product.name,
              style: {
                wordBreak: "break-word",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              },
            }}
            subheader={DateTime.fromMillis(parseInt(reviewedAt))
              .setLocale("fi")
              .toLocaleString(newFormat)}
          />

          <CardMedia
            className={classes.media}
            image={product.image}
            title={product.name}
          />

          <CardContent style={{ display: "flex", alignItems: "center" }}>
            <FormatQuoteIcon color="action" fontSize="large" />
            <Box>
              <Rating
                size="medium"
                precision={0.1}
                name="simple-controlled"
                value={rating}
                label={rating}
                readOnly
              />
              <Typography
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                }}
                variant="body2"
                color="textSecondary"
                component="p"
              >
                {text}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </LinkUI>
    </Grid>
  );
}
