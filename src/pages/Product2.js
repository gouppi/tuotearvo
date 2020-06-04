import React, { useEffect } from "react";

import { useParams } from "react-router-dom";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import BreadcrumbsComponent from "../components/Product/Breadcrumbs";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import LinkUI from "@material-ui/core/Link";
import { Link } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Rating from "@material-ui/lab/Rating";
import Badge from "@material-ui/core/Badge";
import CardMedia from "@material-ui/core/CardMedia";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const PRODUCT_QUERY = gql`
  query productPage($product: Int!) {
    product(id: $product) {
      id
      name
      image
      rating_avg
      group_name
      product_eans
      product_mpns
      category {
        id
        name
        seo_name
      }
      parent_categories {
        name
        seo_name
      }
    }
  }
`;

const Product2 = () => {
  const { category, product } = useParams();
  console.log(category, product);
  return (
    <Query query={PRODUCT_QUERY} variables={{ product: parseInt(product) }}>
      {({ loading, error, data }) => {
        if (loading) return <p>loading...</p>;
        if (error) {
          console.log(error);
          return <p>Error :(</p>;
        }

        console.log("productQuery Product2:", data);
        return (
          <Container maxWidth="xl">
            <Grid container spacing={2} direction="row">
              <Grid item xs={12}>
                <BreadcrumbsComponent product={data.product} />
              </Grid>
              <Grid item xs={12}>
                <Typography style={{ fontWeight: 100 }} variant="h5">
                  {data.product.name}
                </Typography>
                <Badge
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={data.product.rating_avg}
                  color="secondary"
                >
                  <Rating
                    size="large"
                    precision={0.1}
                    name="simple-controlled"
                    value={data.product.rating_avg}
                    label={data.product.rating_avg}
                    readOnly
                  />
                </Badge>
              </Grid>
              <Grid item xs={6}>
                <CardMedia
                  component="img"
                  alt="Contemplative Reptile"
                  style={{ maxWidth: "200px" }}
                  width="auto"
                  image={data.product.image}
                  title="Contemplative Reptile"
                />
              </Grid>
              <Grid item xs={6}>
                <TableContainer component={Paper}>
                  <Table className={""} aria-label="simple table" size="small">
                    <TableBody>
                      {/* <TableRow>
                        <TableCell>Valmistaja</TableCell>
                        <TableCell>{data.product.brand.name}</TableCell>
                      </TableRow> */}
                      <TableRow>
                        <TableCell>EAN-koodi(t):</TableCell>
                        <TableCell align="right">
                          <List dense>
                            {data.product.product_eans.map((ean) => (
                              <ListItem>
                                <ListItemText>{ean}</ListItemText>
                              </ListItem>
                            ))}
                          </List>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Valmistajan tuotekoodi(t):</TableCell>
                        <TableCell align="right">
                          <List dense>
                            {data.product.product_mpns.map((mpn) => (
                              <ListItem>
                                <ListItemText>{mpn}</ListItemText>
                              </ListItem>
                            ))}
                          </List>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Container>
        );
      }}
    </Query>
  );
};

export default Product2;
