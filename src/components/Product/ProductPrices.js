import React from "react";
import Grid from "@material-ui/core/Grid";
import Price from "./Price";

const ProductPrices = (props) => {
  return (
    <Grid container spacing={4}>
        <Price price={props.prices[0]}/>
        <Price price={props.prices[0]}/>
        <Price price={props.prices[0]}/>
        <Price price={props.prices[0]}/>
      {props.prices.map((price) => (

        <Price price={price} />
      ))}
    </Grid>
  );
};

export default ProductPrices;
