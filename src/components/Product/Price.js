import React from "react";
import Card from "@material-ui/core/Card";

import CardActionArea from "@material-ui/core/CardActionArea";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const Price = ({price}) => (
  <Grid container style={{display:"flex", justifyContent:"center", alignItems:"center"}} item xs={12} spacing={3}>
      <Grid item xs={2}>
      <CardMedia
          component="img"
          alt="Verkkokauppa.com"
          image="https://cdn.verk.net/files/5a7d9/d96aa/71dd6/2053a/8f74.svg"
          title="Verkkokauppa.com"
        />
        </Grid>
        <Grid item xs={4}>
            <p>Tähän tulee tämän kaupan tuotteen nimi</p>
        </Grid>
        <Grid item xs={4}>
        <Typography>
            {price.price}€
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Hinta päivitetty:
            {new Date(parseInt(price.updatedAt)).toLocaleTimeString()}
          </Typography>
        </Grid>
        <Grid item xs={2}>
        <Button variant="contained" size="small" color="secondary">
          Siirry kauppaan
        </Button>
        </Grid>
    {/* <Card>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Verkkokauppa.com"
          image="https://cdn.verk.net/files/5a7d9/d96aa/71dd6/2053a/8f74.svg"
          title="Verkkokauppa.com"
        />
        <CardContent>
          <Typography variant="h4">
            {price.price}€
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Hinta päivitetty:
            {new Date(parseInt(price.updatedAt)).toLocaleTimeString()}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button variant="contained" size="large" color="secondary">
          Siirry kauppaan
        </Button>

      </CardActions>
    </Card> */}
  </Grid>
)

export default Price;
