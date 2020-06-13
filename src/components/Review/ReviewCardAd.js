import React from "react";
import Grid from "@material-ui/core/Grid";
import Image from "material-ui-image";
import Paper from "@material-ui/core/paper";
import ad_square from "../../img/ad_250_250.png";

export default function ReviewCardAd(props, i) {
  return (
    <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
      <Paper variant="outlined" style={{ height: "100%" }}>
        <Image src={ad_square}></Image>
      </Paper>
    </Grid>
  );
}
